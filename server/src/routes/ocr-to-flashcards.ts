import express from 'express'
import vision from '@google-cloud/vision'
import fetch from 'node-fetch'

const router = express.Router()
const visionClient = new vision.ImageAnnotatorClient()

async function callLLMGenerateFlashcards(text: string, targetLang = 'en'){
  const prompt = `You are an educational AI assistant. Given the text below, extract terms and create flashcards. Output JSON array: [{\"front\":\"...\",\"back\":\"...\",\"confidence\":0.0,\"tags\":[]}]. Target language: ${targetLang}\n----\n${text}`

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 800 })
  })
  const body = await resp.json()
  const content = body?.choices?.[0]?.message?.content
  try{
    return JSON.parse(content)
  }catch(e){
    return [{ front: 'Generated', back: content || 'No response', confidence: 0.5, tags: [] }]
  }
}

router.post('/ocr-to-cards', async (req, res)=>{
  // Expect { imageGcsUri?: string, imageBase64?: string, targetLang?: string }
  const { imageGcsUri, imageBase64, targetLang } = req.body
  try{
    let fullText = ''
    if(imageGcsUri){
      const [result] = await visionClient.documentTextDetection(imageGcsUri)
      fullText = result.fullTextAnnotation?.text || ''
    }else if(imageBase64){
      const [result] = await visionClient.documentTextDetection({ image: { content: imageBase64 } })
      fullText = result.fullTextAnnotation?.text || ''
    }else{
      return res.status(400).json({ success:false, error: 'Missing imageGcsUri or imageBase64' })
    }

    const cards = await callLLMGenerateFlashcards(fullText, targetLang || 'en')
    return res.json({ success:true, cards })
  }catch(err:any){
    console.error(err)
    return res.status(500).json({ success:false, error: String(err) })
  }
})

export default router
