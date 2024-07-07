# Pesto TODO App

This project is a web application built using Next.js and React.js. 
For a quick visual overview, you can view a Loom video here: [Loom Video](https://www.loom.com/share/6761ef421f104e58b3948f9740577155?t=121&sid=c0cbac82-5f08-4b92-816e-037be0a9fbeb).

## Technologies Used

* Frontend:
    * Next.js (https://cdn.ampproject.org/c/s/nextjs.org/?amp=1)
    * React.js (https://react.dev/)
    * NextUI (https://nextui.org/)
    * Tailwind CSS (https://tailwindcss.com/docs/installation)
* Database: Firebase Firestore (https://firebase.google.com/docs/firestore)

## Project Structure

The project is organized with the following folders:

* **public:** This folder contains static assets like icons and images that are accessible in the public domain of your application.
* **pages:** This folder utilizes the Next.js Pages folder structure for defining application routes. The `index.js` file serves as the main entry point.
* **api:** This folder houses any API routes required for your project. Firebase setup logic might reside here.
* **utils:** This folder encapsulates reusable code:
    * `constants.ts`: Stores all project-wide constants for consistency and maintainability.
    * `helpers.ts`: Contains custom helper functions to avoid code duplication.
    * `types.ts`: Defines data types for clarity and type safety (especially relevant with TypeScript).

## Running the Project

1. **Development Server:**
    ```bash
    npm run dev
    ```
    This command starts the development server, allowing you to make changes and see them reflected in real-time.

2. **Fixing Lint Issues:**
    ```bash
    npm run lint:fix
    ```
    This command automatically fixes any linting errors identified by your configured static code analyzer. This helps maintain code quality and consistency.

## Additional Notes

* Feel free to customize this README with further details about your project, such as deployment instructions, contributing guidelines, and specific usage instructions.
* Consider including badges for dependencies, licenses, or project status to enhance the README's visual appeal and provide users with quick insights.

This README provides a solid foundation for documenting your Next.js project. Adapt it as needed to best represent your specific application structure and requirements.
