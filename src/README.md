# FinTrack - Expense Tracking Application

FinTrack is a web-based application designed to help users track their expenses, manage budgets, and visualize spending trends. The application provides a user-friendly interface for entering expenses, setting budget limits, and generating financial reports.

## Project Structure

```
src
├── index.html         # Main entry point for the application
├── styles             # Contains CSS styles for the application
│   └── main.css       # Stylesheet defining layout, colors, and typography
├── scripts            # Contains JavaScript files for functionality
│   ├── app.js         # Handles UI interactions and event listeners
│   ├── charts.js      # Manages data visualization for spending trends
│   ├── currency.js    # Fetches exchange rates and converts expenses
│   └── budget.js      # Tracks budget limits and triggers alerts
├── assets             # Contains assets used in the application
│   ├── icons          # Directory for icon files
│   └── images         # Directory for image files
└── README.md          # Documentation for the project
```

## Features

- **Expense Entry**: Users can enter expenses with details such as amount, category, date, and description.
- **Spending Visualization**: Visualize spending trends using pie charts and bar graphs.
- **Currency Conversion**: Dynamically convert expenses based on selected currencies.
- **Budget Management**: Set budget limits for each category and receive alerts when nearing limits.
- **Transaction History**: View and filter past expenses.
- **Report Export**: Download reports in CSV or PDF format.
- **Financial Insights**: Stay updated with financial news.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd src
   ```
3. Open `index.html` in a web browser to view the application.

## Usage Guidelines

- Fill out the expense entry form to log new expenses.
- Use the charts section to visualize your spending habits.
- Set budget limits to manage your finances effectively.
- Access the transaction history to review past expenses.
- Utilize the currency converter for accurate expense tracking across different currencies.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.