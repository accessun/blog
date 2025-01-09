---
title: Workable Steps to Set up Maven in Eclipse
metaDescription: Workable Steps to Set up Maven in Eclipse
pubDate: 2016-12-17
featured: false
categories: ['Technical']
tags: ['maven']
readingTime: 10 min
---

Tested on Windows 10, in Eclipse Neon/Eclipse Neon.1 (the version for Java EE developers), using Maven 3.3.9 (externally installed, not the embedded one in Eclipse)

First [download Maven](https://maven.apache.org/download.cgi) and follow the installation steps on [TutorialsPoint](https://www.tutorialspoint.com/maven/maven_environment_setup.htm).

Then, go to the `M2_HOME` directory. In my case, it is `D:\apache-maven-3.3.9`. Open the `settings.xml` in the `conf/` directory. We need to overwrite two default settings. One is for Maven repository, or simply called repo, the other is about the default jdk for compilation.

If you live in China, it is highly recommended that you use a reliable Maven mirror whose server is physically located in China. Because lots of sites are blocked and most of the unblocked ones are really slow. The following one is maintained by Alibaba. I've used it for quite a while. It works pretty good, at least for the moment this post is written.

Add the following piece of xml code under the `<mirrors>` element.

```xml
<mirror>
  <id>nexus-aliyun</id>
  <name>Nexus aliyun</name>
  <url>http://maven.aliyun.com/nexus/content/groups/public</url>
  <mirrorOf>*</mirrorOf>
</mirror>
```

Change the default compiler to the version of the jdk you are using (default is 1.5 if you do not have this configured). In my case, I use jdk-1.8.

Add the following piece of xml code under the `<profiles>` element.

```xml
<profile>
  <id>jdk-1.8</id>
  <activation>
    <activeByDefault>true</activeByDefault>
    <jdk>1.8</jdk>
  </activation>
  <properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
  </properties>
</profile>
```

Then, we need to configure Maven in Eclipse.

1. In the Eclipse menu, click "Window" and select "Preferences"
2. Expand the tag "Maven" and select "Installations"
3. Click "Add..." button to the right. In the poped up "New Maven Runtime" dialog window, choose the "External" installation type and specify the installation home for Maven. (In my case, the installation home is `D:\apache-maven-3.3.9`)
4. Click "Finish"
5. Back to the "Preference" dialog window, in the "Select the installation used to launch Maven", select the external maven installation you've just added. (Not the "EMBEDDED" one or "WORKSPACE" one)
6. Click "Apply"
7. Back to the "Maven" tag to the left, select the "User Settings" sub-tag. Specify the setting file we've just modified for both "Global Settings" and "User Settings". In my case the path of the file is `D:\apache-maven-3.3.9\conf\settings.xml`. The "Local Repository" should stay default, unless you've changed the path of your local maven repository.
8. Click "OK"

For now, we have done the installation and configurations. Let'us move on to the core topic of working with Maven in Eclipse IDE.

For day-to-day development, two common projects we use are "Java Project" for Java SE development and "Dynamic Web Project" for Java Web development. So, the question is how to incorporate the two kinds of Eclipse projects into their respective Maven projects without sacrificing the day-to-day development workflow in the Eclipse projects that you are familiar with.

Let's deal with the "Java project" first.

1. In the Eclipse menu, click "File", select "New", and choose "Others..."
2. In the pop-up window, type "maven" in the "type filter text" search bar, then select "Maven Project" and click "Next >"
3. Check the "Create a simple project (skip archetype selection)" checkbox. Click "Next >"
4. Specify the artifact for your project. In my case, the group ID is "io.github.accessun" (my blog site in reversed order), the artifact ID is "PlainJavaProject", the version number is "0.0.1-SNAPSHOT", the packaging is "jar". And just leave other fields empty. Then click "Finish"

Alright, done! You can see both the Eclipse source folders and real directory structure in the Project Explorer. Go edit your `pom.xml` and write some Java code!

![maven-plain-java-project](/images/maven-plain-java-project.png)

It is a little bit tricky and odd of the way to set up Maven project for Java web development in Eclipse. The followings are the steps:

1. In the Eclipse menu, click "File", select "New", and choose "Others..."
2. In the pop-up window, type "maven" in the "type filter text" search bar, then select "Maven Project" and click "Next >"
3. Check the "Create a simple project (skip archetype selection)" checkbox. Click "Next >" (Yeah! Do trust my again this time! Select this option even for Java web projects. You can experiment with the archetype selection. I did that. But... the resulted setup turns out to be weird. I don't know why. Maybe this is the Eclipse way, huh?)
4. Specify the artifact settings for group ID, artifact ID, and version just like the above settings for Java project. However, this time you should select "war" for the "Packaging" selection. This indicates that this Maven project is a Java web project.
5. Click "Finish"
6. You'll notice that there is an error symbol on the project. Don't panic. This is expected. Right click on the project in the Project Explorer. Then, choose "Properties".
7. Choose "Project Facets" to the left. Uncheck the "Dynamic Web Module". Click "Apply"
8. Check the "Dynamic Web Module" again. Then there will be a link called "Further configuration available..." appear below. Click on it.
9. In the popup window, change the "Content directory" from "WebContent" to "`src/main/webapp`". Check the "Generate web.xml deployment descriptor" option. Click "OK". Click "OK" again.

Now, we have the basic setup of a Maven project for Java web development in Eclipse. The "`src/main/webapp`" directory is equivalent to the "WebContent" directory in a "Dynamic Web Project" of Eclipse. You can see the `web.xml` file in the "WEB-INF" directory.

![maven-java-web-project](/images/maven-java-web-project.png)

Another thing that should be mentioned is that the auto generated `web.xml` in the settings above is based on web-app version 2.5:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://java.sun.com/xml/ns/javaee"
    xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
    id="WebApp_ID" version="2.5" />
```

Changed it to the new 3.1 version if you like. Just copy and replace the code below. This 3.1 version code is auto generated by Eclipse for the "Dynamic Web Project". So you can safely use it.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://xmlns.jcp.org/xml/ns/javaee"
  xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
  id="WebApp_ID" version="3.1">
  <!-- Your web.xml setting goes here -->
</web-app>
```

The final thing that I would also like to mention is that if you create jsp file in the webapp directory, you'll probably get an error saying that "The superclass javax.servlet.http.HttpServlet was not found on the Java Build Path". This is because you haven't specify the servlet and JSP dependencies for Java web development. Just open the `pom.xml` file and add the following two dependencies under the `<dependencies>` element. Note that the scope should be set to `provided` since if you give them a `compile` scope, the two dependencies will be added to your compiled project. This may cause a collision with the servlet and JSP APIs provided by the servlet container, say Tomcat. `provided` ensures that the two dependencies are only effective when needed during the development process. After deployment, the corresponding APIs from the actual container is used instead.

```xml
<dependency>
  <groupId>javax.servlet</groupId>
  <artifactId>servlet-api</artifactId>
  <version>2.5</version>
  <scope>provided</scope>
</dependency>

<dependency>
  <groupId>javax.servlet</groupId>
  <artifactId>jsp-api</artifactId>
  <version>2.0</version>
  <scope>provided</scope>
</dependency>
```

Alright. Now we have our topic covered. Happing coding!
