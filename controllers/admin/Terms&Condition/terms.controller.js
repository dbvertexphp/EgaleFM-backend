import { TermsConditions } from "../../../models/admin/TermsModel/terms.model.js";

export const addTerms = async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(200).json({ message: "Content required", status: false });

  try {
    let data = await TermsConditions.findOne();
    if (data) {
      data.content = content;
      await data.save();
      return res.status(200).json({ message: "Terms updated!", status: true, data });
    } else {
      data = await TermsConditions.create({ content });
      return res.status(201).json({ message: "Terms created!", status: true, data });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

// export const getTerms = async (req, res) => {
//   try {
//     const data = await TermsConditions.findOne();
//     res.status(200).json({ status: true, data });
//   } catch (error) {
//     res.status(500).json({ message: error.message, status: false });
//   }
// };
export const getTerms = async (req, res) => {
  try {
    const data = await TermsConditions.findOne();
    
    // Agar database mein content nahi hai toh default text
    const content = data ? data.content : "<h1>Terms & Conditions</h1><p>Update coming soon...</p>";

    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.7;
                  padding: 20px;
                  color: #333;
                  background-color: #fff;
                  word-wrap: break-word;
              }
              h1, h2, h3 { 
                  color: #2c3e50; 
                  border-bottom: 2px solid #f1f1f1; 
                  padding-bottom: 8px;
                  margin-top: 25px;
              }
              p { margin-bottom: 15px; }
              ul { padding-left: 20px; color: #555; }
              li { margin-bottom: 10px; }
              .footer { 
                  margin-top: 40px; 
                  font-size: 0.8em; 
                  color: #999; 
                  text-align: center; 
              }
          </style>
      </head>
      <body>
          <div class="content">
              ${content}
          </div>
          <div class="footer">
              © ${new Date().getFullYear()} Your App Name. All rights reserved.
          </div>
      </body>
      </html>
    `;

    // Response Headers set karein
    res.set('Content-Type', 'text/html');
    res.status(200).send(htmlResponse);

  } catch (error) {
    res.status(500).send("<h3>Error loading Terms and Conditions</h3>");
  }
};