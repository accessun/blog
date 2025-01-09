---
title: Java Initialization Blocks
metaDescription: Java Initialization Blocks
pubDate: 2016-09-18
featured: false
categories: ['Technical']
tags: ['java']
readingTime: 15 min
---

Initialization blocks in Java are used for initializing when a class is loaded or an instance is instantiated. Java has two kinds of initialization block, namely, static initialization block and instance initialization block (or non-static initializer block). These two kinds of block may seem a little bit odd when one first comes across them.

Initialization blocks in Java are used for initializing when a class is loaded or an instance is instantiated. Java has two kinds of initialization block, namely, static initialization block and instance initialization block (or non-static initializer block). These two kinds of block may seem a little bit odd when one first comes across them.

We know that static fields in a class can be simply initialized by assigning them on declaration, like the following.

```java
static T var = ...;
```

But sometimes, it is required that some work needs to be done before they are assigned to those fields. It is quite handy to use static initialization blocks in these circumstances. In the `DemoUtil` class below, the code that deal with initialization is specified within the pair of curly braces after the `static` key word. Before the assignment to the static field `var` of type `T` is carried out, some pre-precessing work is done before the assignment.

```java
public class DemoUtil {
    static T var;

    static {
        // some pre-processing to var before assignment
        var = ...;
    }

    // other code comes below
}
```

Instance initialization blocks, or non-static initializer blocks are used in a very similar fashion. In the following `Demo` class, you can directly perform some other operation before assigning value to the instance field `var` of type `T`.

```java
public class Demo {
    T var;

    {
        // some pre-processing and instance field assignment
        var = ...;
    }

    // other code comes below
}
```

It seems that we can also achieve the same goal by using constructor in the `Demo` class. Then, what is the difference between constructor and instance initialization block?

Sometimes, we may have multiple constructors overloaded.

```java
public Demo() {
    // routine B
}

public Demo(boolean flag) {
    // routine C
}

public Demo(String info, boolean flag) {
    // routine D
}
```

And in some cases, we want to share common routine among all constructors. More specifically, we want common routine, say `routine A`, to be performed before all the routines in each constructor. Then you can put `routine A` into instance initialization block. `routine A` will then be copied into the beginning part of each constructor on compiling. However, it makes no difference if you cut the code in the constructor and paste it into an instance initialization block when your class only has one single constructor.

```java
public Demo() {
    // <-- [routine A will be copied here on compiling]
    // routine B
}

public Demo(boolean flag) {
    // <-- [routine A will be copied here on compiling]
    // routine C
}

public Demo(String info, boolean flag) {
    // <-- [routine A will be copied here on compiling]
    // routine D
}

{
    // routine A
}
```

### Execution order of multiple initialization blocks

When multiple initialization blocks and constructors are simultaneously present in a class, it is important that we should be aware of the order of execution of each code block. The following is an example designed to clarify this point.

```java
public class Temp {
    
    public Temp() {
        System.out.println("Temp()");
    }
    
    public Temp(int val) {
        System.out.println("Temp(int val)");
    }
    
    static {
        System.out.println("First static init block");
    }
    
    static {
        System.out.println("Second static init block");
    }
    
    {
        System.out.println("First non-static init block");
    }
    
    {
        System.out.println("Second non-static init block");
    }
    
    public static void main(String[] args) {
        new Temp();
        System.out.println("====================");
        new Temp();
        System.out.println("====================");
        new Temp(0);
    }
}
```

```
// output
First static init block
Second static init block
First non-static init block
Second non-static init block
Temp()
====================
First non-static init block
Second non-static init block
Temp()
====================
First non-static init block
Second non-static init block
Temp(int val)
```

In this example code, we can observe that once the class is loaded, the code within the static block is immediately executed and is executed only once. When multiple static blocks are present, they are executed in the order of their presence in the class. The code in instance initialization blocks are called each time before any constructor is called. And they are called every time on every instance initialization. (This is because the compiler just copies the code in the instance initialization block into every constructor of the class when the source code is compiled to Java byte code.) The order of execution of instance initialization block is also in accordance with their presence in the class.