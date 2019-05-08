#include <cxxtest/TestSuite.h>

class TestAdd: public CxxTest::TestSuite
{
public:
    void testAddition(void)
    {
        TS_TRACE("Starting Additions test");
        TS_ASSERT(1 + 1 > 1);
        TS_ASSERT_EQUALS(1 + 1, 2);
    }
};
