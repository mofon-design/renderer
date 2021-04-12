#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  exec "$basedir/node"  "$basedir/../wc-bundler/bin/index.js" "$@"
else
  exec node  "$basedir/../wc-bundler/bin/index.js" "$@"
fi
