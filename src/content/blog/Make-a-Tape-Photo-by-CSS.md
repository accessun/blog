---
title: Make a Tape Photo by CSS
metaDescription: Make a Tape Photo by CSS
pubDate: 2016-10-16
featured: false
categories: ['Technical']
tags: ['css']
readingTime: 15 min
---

In this blog, we'll imitate a taped photo on web browser with HTML and CSS. The following image demonstrates the intended result.

![](/images/taped-photo_1.png)

This example demonstrates some technique to utilize CSS position to achieve this effect.

First, let's prepare the draft HTML that we are going to work with.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Taped Photo by CSS</title>
    <style>
        body {
            background-color: #222;
        }
        .photo {
            margin: 50px auto; /* center the div horizontally */
            border: 5px solid #fff;
            width: 250px;
            height: 250px;
        }
        #dog-image {
            width: 250px;
            height: 250px;
        }
    </style>
</head>
<body>
<div class="photo">
    <img id="dog-image" src="dog.jpg">
</div>
</body>
</html>
```
In this HTML template, a dark background color is chosen. We will use a pseudo element  to imitate the tape. And since pseudo elements like `:before` and `:after` [won't work with replaced elements](http://stackoverflow.com/questions/6949148/css-after-not-adding-content-to-certain-elements), we nest the `img` element within a `div`.

The `margin: 50px auto` in the `.photo` CSS rule specifies that the top and bottom margin of the `div` with a `photo` class to be 50 pixels and that let the browser automatically adjust the left and right margin of this div, which centers the div horizontally.

Now, we get the basic photo effect to work on.

![](/images/taped-photo_2.png)

We will use a pseudo element to imitate the tape. Then we add a CSS rule:

```css
.photo:before {
    content: "";
    height: 25px;
    width: 80px;
    background-color: rgba(255, 255, 255, .3);
}
```

This CSS rule inserts a pseudo element before all the elements within the `div` of class `.photo`. The inserted pseudo element is of empty content but with specified height, width and background color. We aim to make this element to present itself as a rectangle on the web page. However, by default, this pseudo element is statically positioned and invisible on the browser. So, we subsequently give it an absolute position and zero top and zero left attribute so that it will be removed out of the typical flow of how elements are positioned on the page (by default the elements are all statically positioned) and will be scooted to the top left corner of the window.

```css
.photo:before {
    content: "";
    height: 25px;
    width: 80px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, .3);
}
```

Oops! The tape flies far apart from our photo! This is not we intended. The `position: absolute;` removes the element out of the flow of document and positions the element relatively to its **first non-statically positioned ancestor**. And since there is no non-statically positioned ancestor of `.photo` div.  It is positioned relative to the whole browser window.

Now, if we set the `.photo` div to be positioned relatively and make its `:before` pseudo element positioned absolutely. The pseudo element will be positioned relative to its **first non-statically positioned ancestor** which is the `.photo` div in this case.

```css
.photo {
    margin: 50px auto;
    border: 5px solid #fff;
    width: 250px;
    height: 250px;
    position: relative;
}
.photo:before {
    content: "";
    height: 25px;
    width: 80px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, .3);
}
```

Since the `div` has 5 pixels width border, we specifies `-5px` offset to both of the pseudo element's `top` and `left`.

```css
.photo:before {
    content: "";
    height: 25px;
    width: 80px;
    position: absolute;
    top: -5px;
    left: -5px;
    background-color: rgba(255, 255, 255, .3);
}
```

Now, we have our tape placed at the top left corner of the `div`:

![](/images/taped-photo_3.png)

The next step is to:

1. move the pseudo element left a bit
2. move the pseudo element down a little bit
3. rotate it counter-clockwise for 45 degree

We use `translateX()`, `translateY()`, and `rotate()` three functions to specify `transform` rule. `translateX(-30%)` means move the element left 30% of its own width. `translateY(10%)` is to move the element down 10% of its own height. Then we use `rotate(-45deg)` to make the element rotate 45 degree counter-clockwise.

```css
.photo:before {
    content: "";
    height: 25px;
    width: 80px;
    position: absolute;
    top: -5px;
    left: -5px;
    background-color: rgba(255, 255, 255, .3);
    transform: translateX(-30%) translateY(10%) rotate(-45deg);
}
```

 Finally, let's add some shadow effect to both the containing `div` which mimics the white border of the photo and the pseudo element which is the tape here. To better improve the effect, we can put double layers of shadow behind the `div`. So you see two parallel specs separated by a comma in the `box-shadow ` rule of the `div` element. I put the final intact HTML in the following code section.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Taped Photo by CSS</title>
    <style>
        body {
            background-color: #222;
        }
        .photo {
            margin: 50px auto;
            border: 5px solid #fff;
            width: 250px;
            height: 250px;
            position: relative;
            box-shadow: 0px 10px 7px rgba(0, 0, 0, 0.4), 0px 20px 10px rgba(0, 0, 0, 0.2);
        }
        #dog-image {
            width: 250px;
            height: 250px;
        }
        .photo:before {
            content: "";
            height: 25px;
            width: 80px;
            background-color: rgba(255, 255, 255, .3);
            position: absolute;
            top: -5px;
            left: -5px;
            transform: translateX(-30%) translateY(10%) rotate(-45deg);
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
        }
    </style>
</head>
<body>
<div class="photo">
    <img id="dog-image" src="dog.jpg">
</div>
</body>
</html>
```