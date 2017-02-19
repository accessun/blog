---
title: >-
  A simple demonstration of data relation design using Entity-Attribute-Value
  model
date: 2016-08-31 23:01:35
tags: 
- Database
- SQL
- MySQL
- MongoDB
---

Traditional relational database schema is often the most appropriate choice for most cases. At the beginning stage of development, designing a proper data relation often requires extensive thinking and planning before diving into the real development stage. This is because the entity relations on which business logic is based upon is dependent on the relation of data in the database. Improper design of data relation may lead to difficulties and bad design patterns on the upper levels. Also, data relations serve real world demands. However, sometimes, demands are not quit fit into our well established and readily accepted relational schema. For example, say, we have a set of clinical experimental data. Suppose we have one sample which is represented by `sampleId` for each patient. And every patient has a `patientId` to be uniquely identified. So every record has three common columns: `id`, `sampleId`, `patientId`. Although each patient has one sample, different experiments that generate various kinds of data are carried out based on the samples the patients provided. Thus, every record for the patients may have different fields besides the three common fields. The block below is one possible example of three records. As we know, traditional relational database requires a fixed number of columns. If our preference is not to squeeze all the different fields into one column of string for all the patients, it is unrealistic to fit all the data into one table due to the varying number of fields for each record. Apparently, a new kind of design pattern is required.

```
[Record 1] id: 1, sampleId: "s201608181738", patientId: "p281641", expBl: "pt90", expPT: 123.2
[Record 2] id: 2, sampleId: "s201608181739", patientId: "p271632", expBl: "pt90", expPT: 120.2, byProduct: "sap_protein"
[Record 3] id: 3, sampleId: "s201608181740", patientId: "p278435", axLevel: "A", flowRate: 59.6
...
```

One model that suits this kind of scenario is [Entity-Attribute-Value Model](https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model). The three common fields in our case can be extracted into an entity table `BASE_INFO` which stores the common information for all the patients. Each record in the entity table has a set of attribute-value pairs which are specified in the attribute table named `EXTRA_ATTR`. In `EXTRA_ATTR`, `entityId` column is add a foreign key constraint that references the `id` field in `BASE_INFO`. The following two tables signify how the above three records are arranged into tables using EAV model.

**Entity Table: BASE_INFO**

| id   | sampleId      | patientId |
| ---- | ------------- | --------- |
| 1    | s201608181738 | p281641   |
| 2    | s201608181739 | p271632   |
| 3    | s201608181740 | p278435   |

**Attribute Table: EXTRA_ATTR**

| id   | entityId | attrName  | attrValue   |
| ---- | -------- | --------- | ----------- |
| 1    | 1        | expBl     | pt90        |
| 2    | 1        | expPt     | 123.2       |
| 3    | 2        | expBl     | pt90        |
| 4    | 2        | expPt     | 120.2       |
| 5    | 2        | byProduct | sap_protein |
| 6    | 3        | axLevel   | A           |
| 7    | 3        | flowRate  | 59.6        |

Once data relation was determined, checking out all of the optional fields (fields that are not common for all records) can be easily performed by one simple line of SQL query:

```SQL
SELECT attrName, GROUP_CONCAT(entityId) AS "containedEntityId"
FROM EXTRA_ATTR
GROUP BY attrName
ORDER BY attrName;
```

The queried result is:

| attrName  | containedEntityId |
| --------- | ----------------- |
| axLevel   | 3                 |
| byProduct | 2                 |
| expBl     | 1,2               |
| expPt     | 1,2               |
| flowRate  | 3                 |

In this query, the first column `attrName` lists all the optional attributes appeared in the table `EXTRA_ATTR`. The second column presents the IDs of entity that contains each optional attribute. Based what optional attribute we want to extract, we can perform a query intended for the complete set of fields for every record.

For instance, in the above query, we've already known that both the entities that correspond to ID 1 and ID 2 have two common optional attributes which are `expBl` and `expPt`. We now can query basic information including these two optional common attribute by joining tables.

```SQL
SELECT b.`id`, b.`patientId`, b.`sampleId`, e.`attrValue` AS "expBl", e1.`attrValue` AS "expPt"
FROM BASE_INFO b
LEFT OUTER JOIN EXTRA_ATTR e
ON e.`entityId` = b.`id` AND e.`attrName` = "expBl"
LEFT OUTER JOIN EXTRA_ATTR e1
ON e1.`entityId` = b.`id` AND e1.`attrName` = "expPt"
WHERE b.id IN (1, 2);
```

The result is:

| id   | patientId | sampleId      | expBl | expPt |
| ---- | --------- | ------------- | ----- | ----- |
| 1    | p281641   | s201608181738 | pt90  | 123.2 |
| 2    | p271632   | s201608181739 | pt90  | 120.2 |

The above is a simple demonstration of how to use EAV model in practice. The advantages of using EAV model lies in the flexibility in custom columns, especially when certain attributes may be included after database structure is determined or may not be quite common for different records. However, there are tradeoffs for this flexibility. The basic one is that this design pattern blatantly goes against [database normalization](https://en.wikipedia.org/wiki/Database_normalization). We can see that, in the table `EXTRA_ATTR`, a considerable amount of data redundancy is introduced into database. Besides, all the attribute values reside in one column of type `VARCHAR` in `EXTRA_ATTR`, which means we've lost constraints of data type in database level. Another point is that the query statement relatively complex and part of it has to be dynamically generated based on which optional fields the client wants to query. The query statement involves quite a lot self-joining of attribute table when one wants to query many optional attributes. This leads to a significantly degraded performance.

EAV model does have its place in database design. However, this model is not quite relational. And applying it means that you have to lose some good things relational database there is to offer, such as precise data type constraints and properly arranging them in an intact [database schema](https://en.wikipedia.org/wiki/Database_schema). My opinion is that use it only if you have to. One alternative choice is to use document based [NoSQL](https://en.wikipedia.org/wiki/NoSQL) database like [MongoDB](https://en.wikipedia.org/wiki/MongoDB). MongoDB arranges data into documents. A document corresponds to a [JSON](http://www.json.org/) object in database, though it is internally implemented by [BSON](https://www.mongodb.com/json-and-bson) (Binary encoded JSON like document). One can view a document as a record in relational database. All the documents are arranged into a collection, which is to some degree similar to the concept of table in relational database. One great flexibility of adopting document base database is that one is not constraint by relational schema at all. Documents in a collection can have different fields and different number of fields. So, the three records in our above example looks like the following JSON like documents in MongoDB:

```json
{ "_id": ObjectId("57c183f24d8b1fe3db9bc6ab"), "sampleId": "s201608181738", "patientId": "p281641", "expBl": "pt90", "expPT": 123.2 }
{ "_id": ObjectId("57c183f24d8b1fe3db9bc6ac"), "sampleId": "s201608181739", "patientId": "p271632", "expBl": "pt90", "expPT": 120.2, "byProduct": "sap_protein" }
{ "_id": ObjectId("57c183f24d8b1fe3db9bc6ad"), "sampleId": "s201608181740", "patientId": "p278435", "axLevel": "A", "flowRate": 59.6 }
```
