---
title: Learning Plan for a Java Backend Developer
date: 2016-07-31 22:05:46
tags:
---

Here is a list of points of knowledge I prepared for myself to learn or to review in order to be an advanced Java backend developer.

### Java Fundamentals

- Collection, `java.util.concurrent`, **IO/NIO**, reflection

> NIO: overview of [netty](http://www.infoq.com/cn/articles/netty-high-performance/); review the source of [netty](http://netty.io/)

- Dynamic proxy, CGLIB

> How to generate proxy class

- JVM, JMM (JVM Memory Model)

> Mechanism of garbage collection (CMS GC + G1 GC)
> JMM: refer to java language specification
> JVM optimization: **parameter optimization**
> ConcurrentHashMap, CopyOnWrite, Thread pool, CAS, AQS

### Commonly used Frameworks

- Spring
  - IOC/AOP (design patterns): just skip through its source code
  - Source code level
- MyBatis
  - Source code level

### Database

- MySQL
  - common practice of parameter settings
  - how to choose storage engine
  - how to choose index engine
  - table design
  - SQL optimization
- Redis
  - internals
  - common practice of parameter settings

### Web

- HTTP Protocol: wikipedia
- SOA: wikipedia
- Caching
  - Guava cache
  - memcached
  - redis
- Serialization (Google protocol buffer)
- RPC
  - dubbo
- JMS
  - internals

### Basics

- Algorithm & Data structure
  - <= Red-black tree
  - IOC/AOP
  - Design pattern (~ 15) ~> Wikipedia

### Software Engineering and Management

[High-Quality Software Engineering](http://lurklurk.org/hqse/hqse.html)

## References

- [Watchmen](http://watchmen.cn/portal.php)
- [Collections of Java interview questions](http://blog.csdn.net/jackfrued/article/details/17339393)
- MyBatis Caching
  - [link_1](http://www.cnblogs.com/selene/p/4638648.html)
  - [link_2](http://my.oschina.net/dxqr/blog/123163)
  - [link_3](http://blog.csdn.net/luanlouis/article/details/41408341)