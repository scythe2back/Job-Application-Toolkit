# Job Application Toolkit

Make an ATS-friendly resume or CV, write a cover letter and application emails, track your applications and practice for interviews. It runs entirely in your browser, with Philippine job applications in mind.

## Getting started

1. Download or clone this repository.
2. Keep all the files in the same folder.
3. Open `index.html` in a modern web browser.

There is nothing to install or build.

## Features

| Tab | What you can do |
|---|---|
| **Resume** | Build Philippine, Harvard / US or academic CV styles, keep several versions, check the ATS checklist, and export to Word, PDF or plain text |
| **Cover letter** | Write a letter from your resume and a job target, then export it |
| **Email** | Draft application, follow-up, thank-you, salary negotiation, reference request, accept, decline and resignation emails |
| **Tracker** | Manage your applications (see below) |
| **Interview** | Practice common questions, build STAR answers and use a practice timer |
| **PH tools** | Copy declaration and data privacy wording, and prepare a worksheet for CS Form 212 (Personal Data Sheet) |

The **Guide** button gives an overview and holds backup and restore.

### Tracker

- Search, and filter by stage using the colored counts.
- Track interview dates and follow-ups. Due follow-ups are highlighted.
- Save the job link, posting, salary, benefits, location, contact and resume version under **Details**.
- Use **Insights** to see stats by job source and compare offers.
- Use **More** to export a calendar file (`.ics`), or download and import `.csv` files.

When importing a `.csv`, the first row needs a **Company** or **Role** column. Write dates as `2026-11-27` or `11/27/2026` (month first). Importing adds applications and skips duplicates.

## Your data

- Everything is saved in your browser's local storage, on your own device. The app has no accounts and no server of its own.
- People who use the same browser profile can see and change your data.
- Clearing browser data erases it. Opening the app from a different location or browser may show it empty.
- Use **Guide → Download backup** regularly. **Restore backup** replaces the data in the browser with the backup's contents.
- Backup files are not encrypted and contain personal details. Store them somewhere private.

## Internet and AI features

- Most of the app works offline, including Word and PDF export.
- Importing a **PDF** resume needs an internet connection, because the PDF reader is loaded from cdnjs.
- AI features (tailoring a resume, writing with Claude and interview coaching) are available only when the app runs in an environment that provides Claude. They are hidden or unavailable when you open `index.html` directly.
- Without AI, an imported resume fills in your contact details and places the rest of the text in one Experience entry for you to organize.

## Project structure

| File | Contents |
|---|---|
| `index.html` | Page markup |
| `styles.css` | Styles, including light and dark themes |
| `script.js` | Application logic |
| `jszip.min.js` | [JSZip](https://stuk.github.io/jszip/) 3.10.1, used for Word files |
| `jspdf.min.js` | [jsPDF](https://github.com/parallax/jsPDF) 2.5.1, used for PDF export |

## Notes

- The sample details are fictional.
- The ATS checklist is guidance and does not guarantee how an employer's system reads a resume.
- The PDS worksheet does not replace the official CS Form 212. Check the job posting for the current form.
- JSZip and jsPDF are third-party libraries under their own licenses.
