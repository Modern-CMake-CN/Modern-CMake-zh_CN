#pragma once

#include <vector>
#include <tuple>

/// \brief 对向量进行累加计算，生成分布的均值和二阶矩。
///
/// 计算双精度浮点数（double）向量的均值和二阶矩。
///
std::tuple<double, double> accumulate_vector(
    const std::vector<double>& values ///< 待计算的数值向量
);
