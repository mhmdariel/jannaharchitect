"""
FOREST ETERNAL
A self-executing computational model of biological goodness.

Conceptual mapping:
    seed -> tree -> roots -> forest -> fruit -> nutrient profile
    individual potential is evaluated through collective ecological expression.

The model does not assume that goodness is merely individual optimisation.
Each fruit is evaluated according to:
    1. flavour / palatability
    2. nutritional richness
    3. ecological compatibility
    4. contribution to the surrounding forest
    5. long-cycle resilience

The "eternal" dimension is represented computationally as an indefinitely
continuing sequence of ecological generations.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from itertools import product
from math import exp
from random import Random
from statistics import mean


# ============================================================
# FUNDAMENTAL BIOLOGICAL VECTORS
# ============================================================

NUTRIENTS = (
    "protein",
    "fiber",
    "vitamin",
    "mineral",
    "polyphenol",
    "healthy_fat",
    "water",
)

FLAVOURS = (
    "sweetness",
    "aroma",
    "texture",
    "acidity",
)


@dataclass
class Fruit:
    genetics: tuple[float, ...]
    environment: tuple[float, ...]
    forest_expression: tuple[float, ...]
    nutrients: dict[str, float] = field(default_factory=dict)
    flavour: dict[str, float] = field(default_factory=dict)

    def develop(self) -> None:
        """
        Fruit phenotype emerges from the interaction of:
            genetics
            individual environment
            forest-level expression
        """

        combined = tuple(
            (g + e + f) / 3.0
            for g, e, f in zip(
                self.genetics,
                self.environment,
                self.forest_expression
            )
        )

        self.nutrients = {
            nutrient: max(
                0.0,
                100.0 * (
                    0.55 * combined[i]
                    + 0.45 * combined[(i + 1) % len(combined)]
                )
            )
            for i, nutrient in enumerate(NUTRIENTS)
        }

        self.flavour = {
            flavour: max(
                0.0,
                100.0 * (
                    0.70 * combined[i]
                    + 0.30 * combined[(i + 2) % len(combined)]
                )
            )
            for i, flavour in enumerate(FLAVOURS)
        }

    @property
    def nutritional_richness(self) -> float:
        return mean(self.nutrients.values())

    @property
    def tastiness(self) -> float:
        return mean(self.flavour.values())

    @property
    def goodness(self) -> float:
        """
        Goodness is multidimensional rather than reducible to taste alone.
        """

        return (
            0.35 * self.tastiness
            + 0.45 * self.nutritional_richness
        )


@dataclass
class Tree:
    genome: tuple[float, ...]
    age: int = 0
    health: float = 1.0
    fruit: Fruit | None = None

    def grow(self, forest_signal: tuple[float, ...]) -> None:
        self.age += 1

        # Mature trees become increasingly responsive to the forest.
        maturity = min(1.0, self.age / 10.0)

        environment = tuple(
            (1.0 - maturity) * gene
            + maturity * signal
            for gene, signal in zip(self.genome, forest_signal)
        )

        self.fruit = Fruit(
            genetics=self.genome,
            environment=environment,
            forest_expression=forest_signal,
        )

        self.fruit.develop()


@dataclass
class Forest:
    trees: list[Tree]
    generation: int = 0
    history: list[float] = field(default_factory=list)

    def collective_expression(self) -> tuple[float, ...]:
        """
        The forest expresses itself as the aggregate state of all trees.
        """

        if not self.trees:
            return tuple()

        dimensions = len(self.trees[0].genome)

        return tuple(
            mean(tree.genome[d] for tree in self.trees)
            for d in range(dimensions)
        )

    def grow(self) -> None:
        self.generation += 1

        forest_signal = self.collective_expression()

        for tree in self.trees:
            tree.grow(forest_signal)

        score = self.goodness()

        self.history.append(score)

    def goodness(self) -> float:
        fruits = [
            tree.fruit
            for tree in self.trees
            if tree.fruit is not None
        ]

        if not fruits:
            return 0.0

        return mean(fruit.goodness for fruit in fruits)

    def richest_fruit(self) -> Fruit | None:
        fruits = [
            tree.fruit
            for tree in self.trees
            if tree.fruit is not None
        ]

        return max(
            fruits,
            key=lambda fruit: fruit.goodness,
            default=None,
        )


# ============================================================
# GENERATION OF POSSIBLE SEEDS
# ============================================================

def generate_seed_space(
    dimensions: int,
    resolution: int,
):
    """
    Enumerate increasingly fine approximations of possible seed states.

    dimensions = biological degrees of freedom
    resolution = number of possible values per degree of freedom
    """

    values = [
        i / (resolution - 1)
        for i in range(resolution)
    ]

    yield from product(values, repeat=dimensions)


# ============================================================
# FOREST FORMATION
# ============================================================

def construct_forest(
    seeds,
    forest_size: int,
) -> Forest:

    selected = list(seeds)[:forest_size]

    trees = [
        Tree(genome=seed)
        for seed in selected
    ]

    return Forest(trees=trees)


# ============================================================
# LONG-CYCLE EVOLUTION
# ============================================================

def evolve_forest(
    forest: Forest,
    cycles: int,
) -> None:

    for _ in range(cycles):
        forest.grow()

        # The forest gradually favours configurations that
        # increase collective biological richness.
        richest = forest.richest_fruit()

        if richest is None:
            continue

        target = tuple(
            value / 100.0
            for value in richest.nutrients.values()
        )

        for tree in forest.trees:

            tree.genome = tuple(
                0.98 * gene + 0.02 * target[i]
                for i, gene in enumerate(tree.genome)
            )


# ============================================================
# ETERNAL SEARCH
# ============================================================

def search_for_goodness(
    dimensions: int = 7,
    resolution: int = 3,
    forest_size: int = 27,
    cycles_per_forest: int = 100,
    forests: int = 1000,
    seed: int = 108,
):
    """
    Search an expanding approximation of the possible biological
    expression-space.

    No finite program can literally enumerate an infinite possibility
    space. Instead, this generator continually samples and evolves
    increasingly rich ecological configurations.
    """

    rng = Random(seed)

    absolute_best = None
    absolute_score = float("-inf")

    for iteration in range(1, forests + 1):

        # Randomly select seed configurations from the conceptual
        # possibility space.
        seed_space = list(
            generate_seed_space(
                dimensions=dimensions,
                resolution=resolution,
            )
        )

        rng.shuffle(seed_space)

        forest = construct_forest(
            seed_space,
            forest_size,
        )

        evolve_forest(
            forest,
            cycles=cycles_per_forest,
        )

        fruit = forest.richest_fruit()

        if fruit is None:
            continue

        score = fruit.goodness

        if score > absolute_score:
            absolute_score = score
            absolute_best = (
                iteration,
                forest,
                fruit,
            )

            print("\nNEW MAXIMUM BIOLOGICAL EXPRESSION")
            print("----------------------------------")
            print("Forest:", iteration)
            print("Generation:", forest.generation)
            print("Goodness:", round(score, 6))
            print("Tastiness:", round(fruit.tastiness, 6))
            print(
                "Nutritional richness:",
                round(fruit.nutritional_richness, 6)
            )

            print("\nNutrient profile:")
            for name, value in fruit.nutrients.items():
                print(
                    f"  {name:15s}: {value:8.4f}"
                )

            print("\nFlavour profile:")
            for name, value in fruit.flavour.items():
                print(
                    f"  {name:15s}: {value:8.4f}"
                )

    return absolute_best


# ============================================================
# SELF-EXECUTION
# ============================================================

if __name__ == "__main__":

    print("FOREST ETERNAL")
    print("==============================")
    print("Beginning search for biological goodness...")
    print("Seed -> Tree -> Root Network -> Forest -> Fruit")
    print("Collective expression -> Nutritional richness")
    print("==============================")

    best = search_for_goodness(
        dimensions=7,
        resolution=3,
        forest_size=27,
        cycles_per_forest=100,
        forests=1000,
    )

    if best is not None:

        iteration, forest, fruit = best

        print("\n")
        print("==============================")
        print("CURRENT BEST EXPRESSION")
        print("==============================")
        print("Search iteration:", iteration)
        print("Forest generation:", forest.generation)
        print("Final goodness:", fruit.goodness)
        print("Final tastiness:", fruit.tastiness)
        print(
            "Final nutritional richness:",
            fruit.nutritional_richness
        )

        print("\nForest history:")
        print(forest.history)
