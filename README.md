`dbid`: Database Identifier generator
======

A generator of strings to use as database identifiers with at least the following properties:

  - **URL safe**: Generated IDs don't contain any symbols that are special or
    need to be escaped in URLs.
  - **Compact**: Generated IDs use a wire range of symbols (64 in total) so
    they don't waste space.
  - **Monotonic**: Generated IDs always increase in lexicographical order with
    time, so listings of elements sorted by ID are stable in time.


Usage
-----

Install this package using npm:

```
    $ npm install dbid
```

The only exported symbol is a function that generates IDs:

```
    const dbid = require('dbid');
    const id = dbid(); // example: "00Lgt5RJvOAxMBywTnp58l"
```


Details
-------

The generated ID is created using:

  - A 64-bit microsecond timestamp,
  - A 32-bit machine identifier,
  - A 16-bit process identifier, and
  - A 16-bit counter.

All those values are put together in order, and the resulting byte string is
encoded using [`base64-lex`][], a Base64 dialect that ensures lexicographical
order is always preserved.

Usage of a timestamp ensures that multiple IDs generated on machines with their
time coordinated are always roughly increasing in order.  The usage of machine
and process identifiers makes multiple IDs generated at the same time be
distinct from each other, while the counter at the end ensures multiple IDs
generated at the same time by the same process are also distinct.

  [base64-lex]: https://www.npmjs.com/package/base64-lex

Why?
----

After a few years working with MongoDB, I've come to enter a love-hate
relationship with ObjectIDs.  `dbid` is a mix of the good things and solutions
to the bad things, in my opinion.


Notes
-----

There are two things to note about the microsecond timestamp implementation
in this package:

 1. To avoid using native extensions, the [`microtime`][] package is not used.
    Instead, a pure javascript approach is used by combining `Date` and
    `process.hrtime`.  This yields a result that is not entirely accurate to
    the microsecond, and won't reflect clock changes or adjustments performed
    during the execution of the process.  This can be a good or bad thing
    depending on the situation.

  [microtime]: https://www.npmjs.com/package/microtime

 2. The time part of the ID is 64 bits long, but javascript can only accurately
    represent integers up to 53 bits long.  This means that the time value will
    overflow in a couple of centuries and will start losing integer precision.
