CFLAGS=-g -Wall
sources=$(wildcard ./*.c)
objects=$(patsubst %.c,%.o,$(sources))

all: $(objects)
	gcc $(objects) $(CFLAGS) -o main.out

clean:
	find . -name "*~" -exec rm -f {} \;
	find . -name "*.o*" -exec rm -f {} \;

.PHONY: clean
