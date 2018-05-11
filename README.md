`dbid`: Database Identifier generator
======

A generator of strings to use as database identifiers with at least the following properties:

  - **URL safe**: Generated IDs don't contain any symbols that are special or
    need to be escaped in URLs.
  - **Compact**: Generated IDs use a wide range of symbols (64 in total) so
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
    const id = dbid(); // example: "0MDHSlhrk5Y~UnklHOMKDG"
```


Details
-------

The generated ID created using:

  - A 48-bit millisecond timestamp,
  - A 32-bit machine identifier,
  - A 16-bit process identifier, and
  - A 32-bit random number.

All those values are put together in order, and the resulting byte string is
encoded using [`base64-lex`][], a Base64 dialect that ensures lexicographical
order is always preserved, giving a final result of a 22 character string.

Usage of a timestamp ensures that multiple IDs generated on machines with their
time coordinated are always roughly increasing in order.  The usage of machine
and process identifiers makes multiple IDs generated at the same time be
distinct from each other, while the random number at the end ensures multiple
IDs generated at the same time by the same process are also distinct.

  [base64-lex]: https://www.npmjs.com/package/base64-lex
