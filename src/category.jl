module Category

export CategoryObject, CategoryMorphism, compose_morphisms, Functor

struct CategoryObject
    state
end

struct CategoryMorphism
    source::CategoryObject
    target::CategoryObject
    transformation::Function
end

function compose_morphisms(f::CategoryMorphism, g::CategoryMorphism)
    @assert f.target == g.source
    return CategoryMorphism(f.source, g.target, x->g.transformation(f.transformation(x)))
end

struct Functor
    object_map::Dict{Int,Any}
    morphism_map::Vector{CategoryMorphism}
end

end