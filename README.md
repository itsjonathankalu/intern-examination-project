# Front End Intern Examination Project

This project is a message viewer interface for an AI messaging platform, built as part of a front-end internship examination. It displays conversation histories between users and an AI, focusing on functionality, visual design, and performance.

## Features

- **API Route:** A Next.js API route at `/api/messages` securely fetches data from the external source.
- **Message Grouping:** Messages are grouped by date: "Today", "Yesterday", "This Week", and older dates.
- **Sticky Date Headers:** Date group headers remain visible at the top of the screen while scrolling through messages in that group.
- **Visual Distinction:** User and AI messages are clearly distinguished with different background colors and alignment.
- **Formatted Timestamps:** Message timestamps are displayed in a clean, readable format (e.g., 10:30 AM).
- **Loading & Error States:** The interface provides clear feedback to the user while messages are loading or if an error occurs.
- **Jump to Bottom:** A button appears when scrolling up, allowing for quick navigation to the most recent message.
- **Smooth Scrolling:** All scrolling, including the "jump to bottom" feature, is animated smoothly.
- **Responsive Design:** The layout is fully responsive and optimized for mobile, tablet, and desktop views.

## Technical Decisions

- **Framework:** Next.js 14 with App Router and TypeScript, as required by the project description.
- **Styling:** Tailwind CSS was used for its utility-first approach to building responsive and custom designs quickly. `shadcn/ui` was chosen for its accessible, unstyled component primitives which accelerate development while allowing for full design control.
- **Date Management:** `date-fns` was chosen for its lightweight and powerful date manipulation capabilities. It allows for reliable and readable date comparisons needed for the grouping logic.
- **API Route:** An API route was used to proxy requests to the external message API. This is a security best practice that prevents exposing the external API endpoint directly to the client and avoids potential CORS issues.
- **State Management:** Component-level state was managed with React's built-in `useState`, `useEffect`, and `useRef` hooks, which is sufficient for the scope of this application.

## Assumptions

- **"This Week" Definition:** "This Week" is defined as starting on Monday.
- **Scrolling Container:** The primary scrolling container is assumed to be the main `window` object for the purpose of the "jump to bottom" button's scroll detection.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd intern-examination-project
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Bonus Features

- **Message Selection & Copy:** Click on any message to select it, which reveals a button to copy the message content to the clipboard.