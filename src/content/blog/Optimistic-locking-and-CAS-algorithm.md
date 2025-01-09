---
title: Optimistic locking and CAS algorithm
metaDescription: Optimistic locking and CAS algorithm
pubDate: 2017-03-12
featured: false
categories: ['Technical']
tags: ['java', 'concurrency', 'multithreading']
readingTime: 15 min
---

When dealing with problems that required more than one threads of execution running concurrently, if there are multiple threads trying to write to the shared resource, the [critical section](http://tutorials.jenkov.com/java-concurrency/race-conditions-and-critical-sections.html) that contains set operations to the shared resource should be locked up when one thread enters this section. This way of dealing thread safety issue is called pessimistic locking. Why pessimistic? Because the program assumes that any set operations by a thread to the shared resource may cause a collision with other threads, which is a bad thing. Since the possibility of this bad thing happening always exists, we should lock them up when a single thread enters the critical section. This way, the possibility of collision is reduced to zero. The pessimistic "guy" expects bad things and take precautions accordingly to try to reduce risks to a maximum extent. Though the safety issue can be completely solved, the performance is also negatively impacted since all threads have to queue up waiting for its access.

However, someone else has a different way of dealing with this issue. Here comes our lighthearted pal - optimistic locking. This optimistic guy is willing to take risks. When he is assign a task, he just goes forward to do it. If bad things happen, well, just try again.

Optimistic locking in Java is implemented using an algorithm called CAS, which is "Compare-And-Set" or "Compare-And-Swap". By using this algorithm, programs no longer have to lock up the whole critical section. It just attempts to update the shared resource. If the previous attempts failed, it just makes another one until the resource had been successfully updated.

Suppose there is a shared resource which is an `int` variable waits to be updated. For each thread, there are three values involved:

- `V`: the *current* value of this `int` variable in main memory
- `E`: the value of the `int` variable that this thread *expects* to be
- `N`: the *new* value this thread wants to set to the `int` variable

The core operation is the CAS. In order to set the new value to the variable, a thread must follow three steps:

1. Fetch the current value of the variable in main memory which is `V`
2. Compare `V` with the expected value `E`
3. If `V` equals to `E`, set the value of the variable to `N`. If not, try again.

These last two steps are guaranteed as one atomic operation by low level implementation.

One example is the `java.util.concurrent.atomic.AtomicInteger`. A typical `i++` operation is not thread-safe since there are actually three operations going on under the hood: 1. store the value of `i` in a temporary location; 2. increment `i`; 3. give back the original value of `i` stored in the temporary location. With `AtomicInteger`, one can invoke `getAndIncrement()` method on an instance of it to achieve the same purpose. However, this method is thread-safe since it is implemented using CAS.

In JDK 1.7, the source code of `getAndIncrement()` is as follows:

```java
public final int getAndIncrement() {
    for (;;) {
        int current = get();
        int next = current + 1;
        if (compareAndSet(current, next))
            return current;
    }
}
```

In the infinite `for` loop, `get()` gets the current value `V`, the `next` is the new value `N`. `compareAndSet(current, next)` tries to update the value. If not successful, the `return` instruction will not be executed, then it will go for another attempt in the next cycle.

This is the code of `compareAndSet()`. Because it utilizes native code invocation, no Java code can be seen.

```java
public final boolean compareAndSet(int expect, int update) {
    return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
}
```

It feels kind of disappointing if one just stops here. So I tried to implement CAS myself in Java so that the effect of a CAS algorithm can be observed.

Here is my version of `AtomicInteger`. Only some basic operations are implemented.

```java
class MyAtomicInteger {
    private volatile int val; // visibility must be guaranteed

    public MyAtomicInteger() {
        this.val = 0;
    }

    public MyAtomicInteger(int val) {
        this.val = val;
    }

    public int get() {
        return val;
    }

    public void set(int val) {
        this.val = val;
    }

    public void increment() {
        int expected = val;
        int newVal = expected + 1;

        boolean successful = compareAndSet(expected, newVal);

        if (!successful) {
            increment();
        }
    }

    // `compareAndSet` must be guaranteed as one atomic operation
    private synchronized boolean compareAndSet(int expected, int newValue) {
        boolean successful = false;
        int currentValueInMainMemory = val; // read the current value from main memory
        if (expected == currentValueInMainMemory) { // decide if `V` equals to `N`
            val = newValue;
            successful = true;
        }

        // To see it more clearly, let's check out which thread is trying to set value
        System.out.println(Thread.currentThread().getName() + " trying to set value. Successful? " + successful);
        return successful; // notify the invoker if the set operation is successful
    }
}
```

This class is just a wrapper class of an `int` value with some thread-safe methods on that value. The `volatile` modifier is used in order to guarantee the visibility of this value. If you have no idea of what this keyword is used for, you can read my summary of it in another post of my blog or search the internet for more extensive information.

The `increment()` methods increments the value by `1`. The idea of the implementation of this methods is almost no difference from the `getAndIncrement()` method from the original `AtomicInteger` class, except that no value is returned after increment. The `compareAndSet(expected, newVal)` return `true` if a successful set operation has been carried out. If the set operation fails, the method invokes itself again. Recursion is used instead of explicit loop.

To make sure that the "Compare-And-Set" operation is performed atomically. `synchronized` is added to the signature of the method. The code of `compareAndSet(int, int)` is almost self-explanatory. An extra print instruction is added to this method so that we can see which threads are trying to set the value and whether or not their attemps are successful.

In main method of `CasTest` class shown below, 10 threads are started to increment the same `MyAtomicInteger` concurrently. The `while` loop is used to block the main thread until the other 10 threads have all finished their jobs. Finally, the final value of the `MyAtomicInteger` is printed.

```java
public class CasTest {

    static final int THREAD_NUMBER = 10;

    public static void main(String[] args) {
        MyAtomicInteger integer = new MyAtomicInteger();

        for (int i = 0; i < THREAD_NUMBER; i++) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    integer.increment();
                }
            }).start();
        }

        while (Thread.activeCount() > 1) { // block until all other threads are terminated
            Thread.yield();
        }

        System.out.println("Final Result => " + integer.get());
    }
}
```

Here is information printed on my console.

```
Thread-0 trying to set value. Successful? => true
Thread-4 trying to set value. Successful? => true
Thread-2 trying to set value. Successful? => false
Thread-1 trying to set value. Successful? => false
Thread-1 trying to set value. Successful? => true
Thread-2 trying to set value. Successful? => false
Thread-2 trying to set value. Successful? => true
Thread-3 trying to set value. Successful? => true
Thread-5 trying to set value. Successful? => true
Thread-6 trying to set value. Successful? => true
Thread-7 trying to set value. Successful? => true
Thread-8 trying to set value. Successful? => true
Thread-9 trying to set value. Successful? => true
Final Result => 10
```

In this particular execution of program, we can see that Thread-2 had two failed attempts to increment the value. Thread-1 has one failed once. Other threads are quite fortunate. The final value is 10 as anticipated.

OK. The CAS works perfectly, at least for incrementing an `int` value. But does it in all circumstances?

Let's think of a particular situation. Thread "T-1" has just finished the first step of reading `V` and blocked immediately. Let's say, at this moment, the `V` is 5. Then the value is set to 8 and to 5 again by other threads. Now, "T-1" is given its chance of execution again. But to "T-1", `V` is the same as expected, it goes forward to set its new value. This is the famous ["ABA" problem](https://en.wikipedia.org/wiki/ABA_problem). What's the problem with this? Well, Wikipedia gives an excellent example to illustrate this problem:

> John is waiting in his car at a red traffic light with his children. His children start fighting with each other while waiting, and he leans back to scold them. Once their fighting stops, John checks the light again and notices that it's still red. However, while he was focusing on his children, the light had changed to green, and then back again. John doesn't think the light ever changed, but the people waiting behind him are very mad and honking their horns now.

Not all situation using CAS have to take ABA problem into account. This problem matters when the whole system's state is dependent on a particular variable `x` and each change of `x` brings a change to the system's state *regardless what value `x` has*. In this case, for a CAS algorithm, if the value of `x` changes from "A" to "B" and then to "A" again. The state of the whole system changed twice. But the `compareAndSet` method thinks there is no change because it only observes the change of `x`. The `compareAndSet` and the state of the system is out of sync. Troubles will emerge.

In our original example, the only thing we do is to increment an integer. The whole system's state *is* the state of the instance of `MyAtomicInteger`, which is solely defined by the value of the instance. So even in other contrived scenarios where the value may goes like ABA, there is no need to worry about this problem.

In the cases where one has to take ABA problem seriously, [`AtomicStampedReference`](http://tutorials.jenkov.com/java-util-concurrent/atomicstampedreference.html) and `AtomicMarkableReference` should be of help.