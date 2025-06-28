
# Working with the App Prototyper

This document outlines the simple workflow for making changes to your application with my help.

## Step-by-Step Workflow

Our collaboration follows a straightforward, conversational process.

### Step 1: You Make a Request

Simply tell me what you want to do in plain English. You can be as general or specific as you like.

**Examples of good requests:**
*   "Change the primary color of the app to a warm orange."
*   "Add a new 'gallery' page to the dashboard."
*   "Create a form on the 'Staff' page to add a new staff member."
*   "The login button isn't working, can you fix it?"

### Step 2: I Ask Questions (If Necessary)

If your request is unclear, I will ask for clarification to ensure I get it right.

**Example:**
*   **You:** "Add a contact form."
*   **Me:** "Sounds good! What fields should the contact form have?"

### Step 3: I Propose and Apply Changes

Once I understand the task, I will:
1.  Formulate a plan to modify the necessary code files.
2.  Write a short summary of the plan.
3.  Generate an XML block (the `<changes>` block) that contains the full, final content for each file I need to edit.
4.  When I send my response, the system **automatically applies these file changes** to your project. You do not need to copy or paste any code.

### Step 4: You Review and Deploy

After I've applied the changes, your local project files are up-to-date. You can then:
1.  Review the changes in the file editor.
2.  Use the terminal to commit the changes to your GitHub repository.
3.  Your GitHub CI/CD pipeline will then deploy the latest version to your server.

This process allows us to rapidly build and iterate on your application in a collaborative way. I'm ready for your first request!
