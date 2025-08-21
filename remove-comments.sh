#!/bin/bash
for f in $(find . -name "*.js"); do
  strip-comments "$f" > tmp && mv tmp "$f"
done

