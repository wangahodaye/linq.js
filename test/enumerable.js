﻿/// <reference path="testrunner.htm"/>
/// <reference path="qunit.js"/>
/// <reference path="../linq.js" />
/// <reference path="../extensions/linq.qunit.js" />

module("Enumerable");

test("choice", function () {
    actual = Enumerable.choice(1, 10, 31, 42).take(10).toArray();
    notEqual(actual, [1, 10, 31, 42, 1, 10, 31, 42, 1, 10], "random test. if failed retry");
    equal(actual.length, 10);

    actual = Enumerable.choice([1, 10, 31, 42]).take(10).toArray();
    notEqual(actual, [1, 10, 31, 42, 1, 10, 31, 42, 1, 10], "random test. if failed retry");
    equal(actual.length, 10);
});

test("cycle", function () {
    actual = Enumerable.cycle(1, 10, 31, 42).take(10).toArray();
    deepEqual(actual, [1, 10, 31, 42, 1, 10, 31, 42, 1, 10]);
    actual = Enumerable.cycle([1, 2, 3, 4, 5]).take(10).toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);
});

test("empty", function () {
    actual = Enumerable.empty().toArray();
    deepEqual(actual, []);
});

test("from", function () {
    actual = Enumerable.from("temp").toArray();
    deepEqual(actual, ["t", "e", "m", "p"]);

    actual = Enumerable.from(3).toArray();
    deepEqual(actual, [3]);

    actual = Enumerable.from([1, 2, 3, 4, 5]).toArray();
    deepEqual(actual, [1, 2, 3, 4, 5]);

    actual = Enumerable.from({ foo: "bar", func: function () { } }).toArray();
    deepEqual(actual, [{ key: "foo", value: "bar" }]);

    var div = document.createElement("html");
    var last = document.createElement("div");
    last.appendChild(document.createTextNode("test"));
    div.appendChild(document.createElement("div"));
    div.appendChild(document.createElement("div"));
    div.appendChild(last);
    var seq = Enumerable.from(div.getElementsByTagName("div"));
    equal(seq.count(), 3);
    equal(seq.elementAt(2), last);
    equal(seq.elementAt(2).firstChild.nodeValue, "test");
});

test("make", function () {
    actual = Enumerable.make("hoge").toArray();
    deepEqual(actual, ["hoge"]);
});

test("matches", function () {
    actual = Enumerable.matches("xbcyBCzbc", /(.)bc/i).select("$.index+$[1]").toArray();
    deepEqual(actual, ["0x", "3y", "6z"]);
    actual = Enumerable.matches("xbcyBCzbc", "(.)bc").select("$.index+$[1]").toArray();;
    deepEqual(actual, ["0x", "6z"]);
    actual = Enumerable.matches("xbcyBCzbc", "(.)bc", "i").select("$.index+$[1]").toArray();;
    deepEqual(actual, ["0x", "3y", "6z"]);
});

test("range", function () {
    actual = Enumerable.range(1, 10).toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    actual = Enumerable.range(1, 5, 3).toArray();
    deepEqual(actual, [1, 4, 7, 10, 13]);

    Enumerable.range(3, 4).is(3, 4, 5, 6);
    Enumerable.range(-2, 4).is(-2, -1, 0, 1);
    Enumerable.range(-2, 4, 2).is(-2, 0, 2, 4);
});

test("rangeDown", function () {
    actual = Enumerable.rangeDown(1, 10).toArray();
    deepEqual(actual, [1, 0, -1, -2, -3, -4, -5, -6, -7, -8]);
    actual = Enumerable.rangeDown(1, 5, 3).toArray();
    deepEqual(actual, [1, -2, -5, -8, -11]);

    Enumerable.rangeDown(3, 5).is(3, 2, 1, 0, -1);
    Enumerable.rangeDown(-2, 4).is(-2, -3, -4, -5);
    Enumerable.rangeDown(-2, 4, 2).is(-2, -4, -6, -8);
});

test("rangeTo", function () {
    actual = Enumerable.rangeTo(5, 10).toArray();
    deepEqual(actual, [5, 6, 7, 8, 9, 10]);
    actual = Enumerable.rangeTo(1, 10, 3).toArray();
    deepEqual(actual, [1, 4, 7, 10]);
    actual = Enumerable.rangeTo(-2, -8).toArray();
    deepEqual(actual, [-2, -3, -4, -5, -6, -7, -8]);
    actual = Enumerable.rangeTo(-2, -8, 2).toArray();
    deepEqual(actual, [-2, -4, -6, -8]);

    Enumerable.rangeTo(1, 4).is(1, 2, 3, 4);
    Enumerable.rangeTo(-3, 6).is(-3, -2, -1, 0, 1, 2, 3, 4, 5, 6);
    Enumerable.rangeTo(2, -5).is(2, 1, 0, -1, -2, -3, -4, -5);
    Enumerable.rangeTo(1, 5, 3).is(1, 4);
    Enumerable.rangeTo(1, -5, 3).is(1, -2, -5);
    Enumerable.rangeTo(1, -6, 3).is(1, -2, -5);

    Enumerable.rangeTo(4, 4).is(4);
    Enumerable.rangeTo(4, 4, 3).is(4);

});

test("repeat", function () {
    actual = Enumerable.repeat("temp").take(3).toArray();
    deepEqual(actual, ["temp", "temp", "temp"]);
    actual = Enumerable.repeat("temp", 5).toArray();
    deepEqual(actual, ["temp", "temp", "temp", "temp", "temp"]);
});

test("repeatWithFinalize", function () {
    var fin;
    actual = Enumerable.repeatWithFinalize(
                    function () { return "temp"; },
                    function () { fin = "final"; })
                .take(3).toArray();
    deepEqual(actual, ["temp", "temp", "temp"]);
    equal("final", fin);
});

test("generate", function () {
    actual = Enumerable.generate(function () { return "temp" }).take(3).toArray();
    deepEqual(actual, ["temp", "temp", "temp"]);
    actual = Enumerable.generate(function () { return "temp" }, 5).toArray();
    deepEqual(actual, ["temp", "temp", "temp", "temp", "temp"]);
});

test("toInfinity", function () {
    actual = Enumerable.toInfinity().where("i=>i%2==0").take(10).toArray();
    deepEqual(actual, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);
    actual = Enumerable.toInfinity(101).take(5).toArray();
    deepEqual(actual, [101, 102, 103, 104, 105]);
    actual = Enumerable.toInfinity(101, 5).take(5).toArray();
    deepEqual(actual, [101, 106, 111, 116, 121]);
});

test("toNegativeInfinity", function () {
    actual = Enumerable.toNegativeInfinity().where("i=>i%2==0").take(10).toArray();
    deepEqual(actual, [0, -2, -4, -6, -8, -10, -12, -14, -16, -18]);
    actual = Enumerable.toNegativeInfinity(3).take(10).toArray();
    deepEqual(actual, [3, 2, 1, 0, -1, -2, -3, -4, -5, -6]);
    actual = Enumerable.toNegativeInfinity(3, 5).take(4).toArray();
    deepEqual(actual, [3, -2, -7, -12]);
});

test("unfold", function () {
    actual = Enumerable.unfold(5, "$+3").take(5).toArray();
    deepEqual(actual, [5, 8, 11, 14, 17]);
});

test("zipAll", function () {
    Enumerable.zipAll(
            [1, 2, 3],
            [-3, 4, 10],
            function (x, y) { return x * y; })
        .is(-3, 8, 30);

    Enumerable.zipAll(
            [1, 2, 3],
            [-3, 4, 10],
            function (x, y, z) { return z; })
        .is(0, 1, 2);

    Enumerable.zipAll(
            [1, 2, 3],
            [-3, 4, 10],
            [-7, 20, 30, 100],
            function (x, y, z) { return x * y + z; })
        .is(-10, 28, 60);

    Enumerable.zipAll(
            [1, 2, 3],
            [-3, 4, 10],
            [-7, 20, 30, 100],
            function (x, y, z, i) { return z + i; })
        .is(-7, 21, 32);
});

test("merge", function () {
    Enumerable.merge(
            [1, 2, 3],
            [-3, 4, 10])
        .is(1, -3, 2, 4, 3, 10);

    Enumerable.merge(
            [1, 2, 3],
            [-3, 4, 10])
        .is(1, -3, 2, 4, 3, 10);

    Enumerable.merge(
            [1, 2, 3],
            [-3, 4],
            [-7, 20, 30, 100])
        .is(1, -3, -7, 2, 4, 20, 3, 30, 100);
});