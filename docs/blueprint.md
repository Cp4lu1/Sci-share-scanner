# **App Name**: sci-share scanner

## Core Features:

- Image Scanning & Hashing: On user request, scan all images on the active web page, extract their pixel data using a Canvas element, and generate a unique Perceptual Hash (pHash) for each image.
- Duplicate Image Detection: Compare the pHashes of all scanned images and identify 'Potential Duplicates' where image similarity exceeds 90%.
- Transformed Image Detection: For images identified with similar pHashes, detect if they have different aspect ratios or dimensions, flagging them as 'Potential Transformation/Widening'.
- Interactive Image Gallery: Provide a pop-up user interface displaying a gallery of all images found on the page after scanning.
- Visual Flagging for Analysis: Within the image gallery, highlight 'Potential Duplicates' with a RED overlay and 'Potential Transformation/Widening' images with a YELLOW overlay for easy identification.

## Style Guidelines:

- Primary interactive color: A refined blue-grey (#3473B1) for buttons and accents, chosen to evoke precision, technology, and the professional aesthetic of sci-share.com.
- Background color: A very light, almost imperceptible grey-blue (#F0F2F4) for a clean, focused, and bright interface, aligning with sci-share.com's analytical nature.
- Accent color: A crisp cyan (#14B8B8) used sparingly for highlights, complementing the primary blue and reinforcing sci-share.com's modern, technical feel.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a modern, objective, and neutral aesthetic, reflecting the clarity and professionalism of sci-share.com's data analysis.
- Use modern, clear, outline-style icons representing scanning, image analysis, and flagging states, consistent with sci-share.com's clean, data-driven visual language.
- Employ a clean, grid-based layout for the image gallery to ensure clarity and easy comparison of scanned images, echoing the structured presentation found on sci-share.com.
- Implement subtle visual feedback for user interactions such as button clicks and progress during the image scanning process, maintaining a professional and smooth user experience consistent with sci-share.com.