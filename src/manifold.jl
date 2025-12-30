module Manifold

using LinearAlgebra, SparseArrays

export InfiniteMetricTensor, metric_element, sparse_tensor, christoffel_symbols, riemann_tensor

struct InfiniteMetricTensor
    dims::Int
end

function metric_element(tensor::InfiniteMetricTensor, i::Int, j::Int)
    return 0.0
end

function sparse_tensor(tensor::InfiniteMetricTensor)
    return spzeros(tensor.dims, tensor.dims)
end

function christoffel_symbols(tensor::InfiniteMetricTensor)
    return spzeros(tensor.dims, tensor.dims, tensor.dims)
end

function riemann_tensor(tensor::InfiniteMetricTensor)
    return spzeros(tensor.dims, tensor.dims, tensor.dims, tensor.dims)
end

end