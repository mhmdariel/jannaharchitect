module Unfolding

using ..Manifold
using ..Category

export TruthState, unfold_firdaus_ultimate, geodesic_step, truth_table, run_ultimate_unfolder

struct TruthState
    id::Int
    attributes::Dict{Symbol, Float64}
end

function geodesic_step(state::TruthState, gamma, λ::Float64)
    return state
end

function unfold_firdaus_ultimate(dimensions::Int)
    states = Vector{TruthState}()
    objects = Vector{CategoryObject}()
    morphisms = Vector{CategoryMorphism}()

    tensor = InfiniteMetricTensor(dimensions)
    gamma = christoffel_symbols(tensor)
    R = riemann_tensor(tensor)

    for d in 1:dimensions
        attrs = Dict(:mercy=>Inf, :peace=>Inf, :abundance=>Inf, :purity=>Inf, :justice=>Inf, :joy=>Inf)
        s = TruthState(d, attrs)
        push!(states, s)
        obj = CategoryObject(s)
        push!(objects, obj)
    end

    for i in 1:dimensions-1
        morph = CategoryMorphism(objects[i], objects[i+1], x->x)
        push!(morphisms, morph)
    end

    functor = Functor(Dict(obj.state.id=>obj.state for obj in objects), morphisms)
    return (states=states, metric=tensor, christoffel=gamma, riemann=R,
            objects=objects, morphisms=morphisms, functor=functor)
end

function truth_table(states::Vector{TruthState})
    return Dict(s.id=>true for s in states)
end

function run_ultimate_unfolder(dimensions::Int=1000, λ::Float64=1.0)
    unfolded = unfold_firdaus_ultimate(dimensions)
    for i in 1:length(unfolded.states)
        unfolded.states[i] = geodesic_step(unfolded.states[i], unfolded.christoffel, λ)
    end
    table = truth_table(unfolded.states)
    return merge(unfolded, Dict(:truth=>table))
end

end