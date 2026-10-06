export default function MealCard({ meal }) {
  const round = (v) => Math.round(Number(v || 0))
  return (
    <div className="meal-card">
      <div className="meal-card-top">
        <span className="meal-food">{meal.food}</span>
        <span className="meal-grams">{round(meal.grams)}g</span>
      </div>
      <div className="meal-macros">
        P {round(meal.protein)}g · C {round(meal.carbs)}g · F {round(meal.fat)}g
      </div>
    </div>
  )
}
