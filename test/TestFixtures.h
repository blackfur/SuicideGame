#include <cxxtest/TestSuite.h>
#include <string.h>
#include <stdio.h>

class TestFixtures: public CxxTest::TestSuite
{
    char *_buffer;

public:
    static TestFixtures* createSuite()
    {
#ifndef _MSC_VER
        return new TestFixtures();
#else
        return 0;
#endif
    }

    static void destroySuite(TestFixtures* suite)
    { delete suite; }

    // will Not run without 'test' prefix
    void Xtest_nothing()
    {
        TS_FAIL("Nothing to test");
    }

    void setUp()
    {
        _buffer = new char[1024];
    }

    void tearDown()
    {
        delete [] _buffer;
    }

    void test_strcpy()
    {
       printf("\nNormal stdout.\n");
        strcpy(_buffer, "Hello, world!");
        TS_ASSERT_EQUALS(_buffer[0], 'H');
        //TS_ASSERT_EQUALS(_buffer[1], 'e');
        TS_TRACE(_buffer);
    }

    void test_memcpy()
    {
        memcpy(_buffer, "Hello, world!", sizeof(char));
        TS_ASSERT_EQUALS(_buffer[0], 'H');
        //TS_ASSERT_EQUALS(_buffer[1], 'e');
    }
};
