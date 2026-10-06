export default function MealCard({ meal }) {
  return (
    <div className="meal-card">
      <div className="meal-card-top">
        <span className="meal-food">{meal.food}</span>
        <span className="meal-grams">{meal.grams}g</span>
      </div>
      <div className="meal-macros">
        P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g
      </div>
    </div>
  )
}
