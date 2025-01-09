---
title: A simple trick to synchronize multiple ajax callbacks with a subsequent procedure in JavaScript
metaDescription: A simple trick to synchronize multiple ajax callbacks with a subsequent procedure in JavaScript
pubDate: 2017-04-15
featured: false
categories: ['Technical']
tags: ['javascript']
readingTime: 10 min
---

A simple trick to synchronize multiple ajax callbacks with a subsequent procedure in JavaScript
 
In one of the projects I'm currently working on, a situation emerged where I have to use JavaScript to gather all the data acquired by multiple asynchronous AJAX calls and then perform another procedure that relies on the complete data to carry out subsequent operations.
 
The pseudocode is as follows.
 
```javascript
var dataArr = []; // a shared variable
 
// in one function
for (var i = 0; i < someArr.length; i++) {
 
    /*
     * $.get(<URL>, <params>, <callback_function>) is a jQuery AJAX function
     * used to send "GET" HTTP request to a web service identifed by <URL>.
     */
    $.get('someUrl', { 'key1': 'val1',... }, function(result) {
        var elem;
 
        // process result and assign value to elem
        dataArr.push(elem);
    });
}
 
// in another function
operationRelyOnCompleteDataArr();
```
 
`dataArr` is a shared variable (globally scoped in a specific namespace). Multiple methods from the same namespace where `dataArr` resides read or write to it. The `for` loop in the central part of this piece of code belongs to a function. This function launches multiple `GET` AJAX calls to backend. Each call fetches a JSON result and performs some basic processing work and pushes the processed result which is `elem` to `dataArr`. `operationRelyOnCompleteDataArr()` is a function that is dependent on a completed prepared `dataArr`. `operationRelyOnCompleteDataArr()` does not work properly unless the data are prepared.
 
AJAX calls in JavaScript are asychronous calls which means they return immediately (do not wait for response) on sending requests out. Once responses are sent back, the main thread that interpretes and executes the code is notified and then goes back to execute the code in the corresponding callback function. So, at this point, there is no way to guarantee that `dataArr` is complete before calling `operationRelyOnCompleteDataArr()`.
 
How to solve this? A better formulation of this question would be how to ensure that `operationRelyOnCompleteDataArr()` is carried out *after* all the procedures in those callbacks are finished.
 
This sounds like thread cooperation problems in Java. In Java, thread cooperation is realized via `wait()` and `notifyAll()`/`notify()` (or `Lock` & `Condition` in the `java.util.concurrent` package). There is a higher level tool that is used as a join point to connect multiple asychronously working threads to a final summarizing thread - `CountDownLatch`.
 
However, since JavaScript is single threaded by design[1], we can't actually have a exact version of `CountDownLatch` here. But the similar idea can be applied.
 
```javascript
var dataArr = []; // a shared variable
 
/*
* simply a counter with a fancy name
* with this variable we can modify the async procedures into a synchronous fashion
*/
var asyncCountDownLatch = someArr.length;
for (var i = 0; i < someArr.length; i++) {
    $.get('someUrl', { 'key1': 'val1',... }, function(result) {
        var elem;
        // process result and assign value to elem
        dataArr.push(elem);
 
        if (--asyncCountDownLatch === 0) {
            operationRelyOnCompleteDataArr(); // will be executed in the last callback
        }
    });
}
```
 
`asyncCountDownLatch` is just a counter used to synchronize the `operationRelyOnCompleteDataArr()` with the above callbacks. Placing the `operationRelyOnCompleteDataArr()` outside the callbacks will not guarantee that the callbacks have a [*happened-before*](https://en.wikipedia.org/wiki/Happened-before) relation with `operationRelyOnCompleteDataArr()`. Chances are this function is carried out before all callbacks get their chance to finish execution. By putting the call of the function inside the callback and using the `asyncCountDownLatch`, it is guaranteed that this function is only called as a final step during the last callback.
 
[1] For the interpretation and execution of JavaScript code, the is only one thread. Actually, the JavaScript engine maintains multiple working threads behind the backdrop, like the ones that respond to DOM events and processing AJAX calls. [See the reference in Chinese](http://blog.csdn.net/alex8046/article/details/51914205)