---
title: Quick summary on nested class
date: 2017-03-29 22:08:47
tags:
- Java
---

Nested classes are divided into two categories:
1. static nested class
2. non-static nested class (aka inner class)

```java
class OuterClass {
    // static nested class
    static class StaticNestedClass {
    }
}

class OuterClass {
    // non-static nested class (aka inner class)
    class InnerClass {
    }
}
```

## Static Nested Class
- It is **associated with its Outer class**, not instances of the Outer class (same as any other static members)
- How to create an instance of it?
    ```java
    OuterClass.StaticNestedClass nestedObject = new OuterClass.StaticNestedClass();
    ```

## Non-static Nested Class (Inner class)
- It is **associated with an instance of its Outer class** and has direct access to that object's methods and fields
- No static members are allowed in inner class except for constants (like `static final String NAME="Hello"`)
- An instance of `InnerClass` can exist only within an instance of `OuterClass`
- How to create an instance of it?
```java
// must be created from an existing instance of the outer class
OuterClass.InnerClass innerObject = outerObject.new InnerClass();
```

Static fields are not allowed in inner class. However, constants (static final members) are permitted.

```java
class OuterClass {
    class InnerClass {
        static int count; // NOT allowed
        static final String NAME = "Hello"; // no problem
    }
}
```

## Shadowing

```java
public class ShadowTest {

    public int x = 0;

    class FirstLevel {

        public int x = 1;

        void methodInFirstLevel(int x) {
            System.out.println("x = " + x); // just the local variable x

            // "this" is an instance of FirstLevel (nearest enclosing one to this statement)
            System.out.println("this.x = " + this.x);

            // To access the instance of ShadowTest, use "ShadowTest.this"
            System.out.println("ShadowTest.this.x = " + ShadowTest.this.x);
        }
    }

    void outerThis() {
        // "this" is an instance of ShadowTest (nearest enclosing one to this statement)
        System.out.println("outerThis(): this.x = " + this.x);
    }

    public static void main(String... args) {
        ShadowTest st = new ShadowTest();
        ShadowTest.FirstLevel fl = st.new FirstLevel();
        fl.methodInFirstLevel(23);
        st.outerThis();
    }
}
```

Result:

```
x = 23
this.x = 1
ShadowTest.this.x = 0
outerThis(): this.x = 0
```

References:
https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html
https://docs.oracle.com/javase/tutorial/java/javaOO/innerclasses.html