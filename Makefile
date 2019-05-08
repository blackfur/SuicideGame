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
	rmdir /s /q test\build

run:
	@.\build\$(NAME).exe

#	Test
t_file=$(wildcard ./test/*.h)
t_src=$(patsubst ./test/%.h, ./test/build/%.cpp, $(t_file))
t_exe=$(patsubst ./test/%.h, ./test/build/%.exe, $(t_file))
t_build=./test/build

cxxtestgen=.\test\cxxtest-4.3\bin\cxxtestgen
cxxincl=./test/cxxtest-4.3/cxxtest

CPP=g++

$(t_build):
	if not exist ".\test\build" mkdir .\test\build

$(t_build)/%.cpp: ./test/%.h $(t_build)
	$(cxxtestgen) --error-printer -o $@ $<

$(t_build)/%.exe: $(t_build)/%.cpp
	$(CPP) -o $@ -I$(cxxincl) $<

# build test file
buildt: $(t_exe)

# %~fI expands %I to a fully qualified path name
test: $(t_exe)
	for /r ".\test\build" %%i in (*.exe) do %%~fi
