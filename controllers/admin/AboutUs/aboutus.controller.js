import { AboutUs } from "../../../models/admin/AboutUs/about.model.js";
// Add or Edit About Us
export const addAboutUs = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(200).json({
      message: "Please provide content for About Us.",
      status: false,
    });
  }

  try {
    // Check if an "About Us" document already exists
    let aboutUs = await AboutUs.findOne();

    if (aboutUs) {
      // If it exists, update (Edit logic)
      aboutUs.content = content;
      await aboutUs.save();
      return res.status(200).json({
        message: "About Us updated successfully",
        content: aboutUs.content,
        status: true
      });
    } else {
      // If it doesn't exist, create new (Add logic)
      aboutUs = await AboutUs.create({ content });
      return res.status(201).json({
        message: "About Us added successfully",
        content: aboutUs.content,
        status: true
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      status: false,
    });
  }
};

// Get About Us
// export const getAboutUs = async (req, res) => {
//   try {
//     const aboutUs = await AboutUs.findOne();
//     if (!aboutUs) {
//       return res.status(404).json({ message: "About Us not found", status: false });
//     }
//     res.status(200).json({ content: aboutUs.content, status: true });
//   } catch (error) {
//     res.status(500).json({ message: error.message, status: false });
//   }
// };
// Get About Us (Mobile API - HTML Response)
export const getAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne();
    
    if (!aboutUs) {
      return res.status(404).send("<h1>About Us Content Not Found</h1>");
    }

    // Aapka content HTML format mein
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              padding: 15px; 
              color: #333; 
              background-color: #fff;
            }
            h1, h2, h3 { color: #2c3e50; }
            p { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          ${aboutUs.content}
        </body>
      </html>
    `;

    // 1. Header set karein ki data HTML hai
    res.set('Content-Type', 'text/html');
    
    // 2. res.json ki jagah res.send use karein
    res.status(200).send(htmlResponse);

  } catch (error) {
    res.status(500).send("<h3>Error loading About Us page</h3>");
  }
};