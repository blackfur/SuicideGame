#	$@ and $^, which are the left and right sides of the : \
	$< is the first item in the dependencies list

NAME=suici
IDIR=include
headers=$(wildcard ./include/%.h)
DEPS = $(patsubst %,$(IDIR)/%,$(headers))
# LIBS=-lm
CC=gcc
CFLAGS=-g -Wall -I$(IDIR)
sources=$(wildcard ./src/*.c)
objects=$(patsubst ./src/%.c,./build/%.o,$(sources))
buildir=build

all: $(objects)
	$(CC) -o ./build/$(NAME).exe $^ $(CFLAGS) $(LIBS)

$(buildir):
	if not exist "$(buildir)" mkdir $(buildir)

$(buildir)/%.o: ./src/%.c $(DEPS) $(buildir)
	$(CC) -c $< $(CFLAGS) -o $@

.PHONY: clean run
	# \
clean: \
	find . -name "*~" -exec rm -f {} \; \
	find . -name "*.o*" -exec rm -f {} \;

clean:
	rmdir /s /q build

run:
	@.\build\$(NAME).exe
