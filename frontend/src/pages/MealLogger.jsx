import MealCard from '../components/MealCard.jsx'
import '../styles/MealLogger.css'

const MEAL_SECTIONS = [
  {
    type: 'breakfast',
    label: 'Breakfast',
    meals: [
      { food: 'Oats + whey', grams: 90, protein: 28, carbs: 55, fat: 8 },
      { food: 'Banana', grams: 120, protein: 1, carbs: 27, fat: 0 },
    ],
  },
  {
    type: 'lunch',
    label: 'Lunch',
    meals: [
      { food: 'Chicken breast', grams: 180, protein: 42, carbs: 0, fat: 4 },
      { food: 'Rice', grams: 150, protein: 4, carbs: 45, fat: 1 },
      { food: 'Mixed salad + olive oil', grams: 100, protein: 2, carbs: 5, fat: 10 },
    ],
  },
  {
    type: 'snack',
    label: 'Snack',
    meals: [
      { food: 'Greek yoghurt', grams: 170, protein: 17, carbs: 7, fat: 4 },
      { food: 'Almonds', grams: 25, protein: 5, carbs: 5, fat: 13 },
    ],
  },
  {
    type: 'dinner',
    label: 'Dinner',
    meals: [
      { food: 'Salmon', grams: 180, protein: 38, carbs: 0, fat: 20 },
      { food: 'Sweet potato', grams: 200, protein: 3, carbs: 40, fat: 0 },
      { food: 'Broccoli', grams: 150, protein: 4, carbs: 10, fat: 0 },
    ],
  },
]

function sumMacros(sections) {
  return sections
    .flatMap((s) => s.meals)
    .reduce(
      (totals, meal) => ({
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat,
      }),
      { protein: 0, carbs: 0, fat: 0 },
    )
}

export default function MealLogger() {
  const totals = sumMacros(MEAL_SECTIONS)
  const calories = Math.round(totals.protein * 4 + totals.carbs * 4 + totals.fat * 9)

  return (
    <div>
      <h1 className="page-title">Meals</h1>
      <p className="page-subtitle">Today's food, grams, and macros.</p>

      <div className="totals-card">
        <div className="totals-calories">{calories} kcal</div>
        <div className="totals-row">
          <span>P {Math.round(totals.protein)}g</span>
          <span>C {Math.round(totals.carbs)}g</span>
          <span>F {Math.round(totals.fat)}g</span>
        </div>
      </div>

      {MEAL_SECTIONS.map((section) => (
        <section key={section.type} className="meal-section">
          <h2 className="meal-section-heading">{section.label}</h2>
          <div className="meal-list">
            {section.meals.map((meal, i) => (
              <MealCard key={i} meal={meal} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
