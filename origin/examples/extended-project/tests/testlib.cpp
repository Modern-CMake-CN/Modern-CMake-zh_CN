#include <catch2/catch_approx.hpp>
#include <catch2/catch_test_macros.hpp>
#include <modern/lib.hpp>

TEST_CASE( "Quick check", "[main]" ) {
    std::vector<double> values {1, 2., 3.};
    auto [mean, moment] = accumulate_vector(values);

    REQUIRE( mean == 2.0 );
    REQUIRE( moment == Catch::Approx(4.666666) );
}
