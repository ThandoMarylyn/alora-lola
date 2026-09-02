# Alora Lola

Build an AI Productivity Assistant Web Application

Create a modern, professional, responsive AI-powered workplace productivity application called Alora Lola.

The application should feel like a real productivity platform that could be used by employees, students, or professionals to manage their work and get assistance from AI.

1. Overall Design

Create a clean, modern and professional dashboard UI.

The application must support:

Desktop and mobile responsive layouts

Light mode and dark mode

A toggle for switching between light and dark mode

Modern cards and rounded components

Clear typography

Professional spacing and visual hierarchy

Subtle animations and hover effects

Accessible buttons and form elements

A consistent design throughout the application

The default theme should be dark mode, but users must be able to switch to light mode.

Use a professional technology/productivity aesthetic rather than a playful design.

2. Dashboard

Create a main dashboard that gives the user an overview of their productivity.

Include:

Welcome section

Display:

"Good morning! What would you like to accomplish today?"

Include a short AI-generated motivational/productivity message.

Productivity overview cards

Create cards showing:

Tasks completed

Tasks remaining

High-priority tasks

Productivity score

Example:

Tasks Completed: 8
Tasks Remaining: 4
High Priority: 2
Productivity Score: 82%

Today's Tasks

Create a task list containing example tasks.

Each task should have:

Task name

Priority

Due time/date

Completion checkbox

Edit option

Delete option

Allow users to add new tasks.

3. Sidebar Navigation

Create a left sidebar on desktop and a suitable navigation menu on mobile.

Navigation items:

Dashboard

My Tasks

AI Assistant

Productivity Insights

Settings

The currently selected page should be visually highlighted.

Include the Alora Lola logo/name at the top of the sidebar.

4. My Tasks Page

Create a dedicated task management page.

Users should be able to:

Add tasks

Edit tasks

Delete tasks

Mark tasks as completed

Set task priorities

Set deadlines

Filter tasks by:

All

Completed

Pending

High Priority

Include an "Add Task" button.

5. AI Productivity Assistant

Create a dedicated AI chatbot page.

The chatbot should allow users to enter workplace/productivity prompts and receive AI-generated responses.

Create a professional chat interface with:

User messages

AI messages

Chat input field

Send button

Clear conversation option

Loading/typing indicator

Example prompts users can ask:

"Prioritize my tasks for today."

"Help me plan my workday."

"Summarize my tasks."

"How can I improve my productivity?"

"Create a schedule for my tasks."

"Help me write a professional email."

The AI responses should be displayed in a clean conversational format.

Include suggested prompt buttons below the chat input to help new users get started.

6. Platform Support Chatbot

In addition to the productivity AI assistant, create a Help & Support chatbot that specifically helps users who experience problems while using the platform.

This chatbot should be accessible through a floating chat/help button throughout the application.

The support chatbot should help users with issues such as:

Problems adding tasks

Problems deleting tasks

Navigation questions

Dark mode/light mode questions

Account/settings questions

AI assistant questions

General platform troubleshooting

Example:

User:
"I can't add a task."

Support chatbot:
"Let's troubleshoot that. First, check that you've entered a task name. If the problem continues, try refreshing the page."

The support chatbot should be clearly labelled Alora Lola Support so users understand that it is different from the main productivity AI assistant.

If the chatbot cannot solve an issue, it should provide a helpful message such as:

"I couldn't resolve this issue automatically. Please check the Settings or Help section for additional support."

Do not make the support chatbot claim that it has contacted a human or support team unless that functionality actually exists.

7. Productivity Insights

Create a Productivity Insights page.

Display visual productivity information such as:

Tasks completed this week

Tasks completed this month

Productivity score

Completion rate

Most productive period

High-priority task completion

Use simple charts and visual cards.

Below the charts, create an AI Insights & Recommendations section.

Example:

"AI Productivity Insight"

"You completed 80% of your high-priority tasks this week."

"Recommendation"

"Schedule your most important tasks during your most productive hours and avoid unnecessary interruptions during that period."

The insights should be presented in an easy-to-understand way.

8. AI-Generated Recommendations

The application should use the user's tasks and productivity information to provide useful recommendations.

Examples:

Recommend which task should be completed first

Identify overdue tasks

Suggest better task scheduling

Identify productivity patterns

Suggest ways to improve task completion

Recommend prioritization of urgent tasks

Clearly label AI-generated information as AI-generated.

9. Settings Page

Create a Settings page with options for:

Dark mode / Light mode

Notification preferences

AI preferences

Account preferences

Make sure the theme toggle actually changes the application's theme and persists when navigating between pages.

10. Responsible AI Disclaimer

Include a small but visible Responsible AI disclaimer on the AI Assistant page and where appropriate throughout the application.

Use wording similar to:

"Responsible AI: AI-generated responses may contain errors or inaccuracies. Review AI suggestions before using them for important workplace decisions."

Do not make the AI pretend to be a human.

11. Responsive Design

The entire application must work properly on:

Desktop

Laptop

Tablet

Mobile phone

On mobile, transform the sidebar into a mobile-friendly navigation menu.

Make sure:

Buttons remain accessible

Text does not overflow

Chat messages fit the screen

Cards stack appropriately

Tables/lists remain usable

The support chatbot remains accessible

12. Navigation

Make sure every sidebar item actually works.

Users should be able to navigate between:

Dashboard → My Tasks → AI Assistant → Productivity Insights → Settings

Do not create navigation elements that lead to empty pages.

13. Sample Data

Populate the application with realistic sample data so that the dashboard looks complete when first opened.

Example tasks:

Complete project report

Respond to client emails

Prepare presentation

Attend team meeting

Review weekly performance

Submit project documentation

14. Professional UI/UX

The final result should look like a polished SaaS productivity platform.

Prioritize:

Simplicity

Usability

Professional appearance

Clear navigation

Good spacing

Consistent components

Responsive design

Avoid making the interface look like a basic student project.

15. Functionality

Where possible, make the features functional rather than static.

Task creation, editing, deletion and completion should work.

Theme switching should work.

Navigation should work.

The AI chat interface should work with an appropriate AI integration if available.

The support chatbot should provide useful predefined troubleshooting responses if a live AI/API integration is not available.

Do not add fake functionality that appears to work but does nothing.

16. Project Structure

Organize the code cleanly using reusable components.

Use appropriate components for:

Sidebar

Dashboard cards

Task cards

Chat interface

AI messages

Support chatbot

Charts

Settings

Theme toggle

Navigation

Keep the code maintainable and easy to understand.

Final Goal

The finished application should demonstrate an AI-powered productivity application with:

Dashboard Layout

Sidebar Navigation

Responsive Design

Mobile + Desktop Support

Input & Output Sections

AI-generated Responses

Interactive AI Workplace Assistant

AI Productivity Insights

AI Recommendations

Platform Support Chatbot

Dark Mode + Light Mode

Professional UI/UX

Responsible AI Disclaimer

Build the application as a complete, polished prototype rather than a simple landing page.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://alora-lola.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9ea5a254-ea1c-46c5-a2eb-8d27bb747bf4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
