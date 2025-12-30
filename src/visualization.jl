module Visualization

using Plots

export plot_states

function plot_states(states)
    dims = [s.id for s in states]
    mercy = [s.attributes[:mercy] for s in states]
    plot(dims, mercy, title="Firdaus Unfolding - Mercy Attribute", xlabel="Dimension", ylabel="Mercy", legend=false)
end

end