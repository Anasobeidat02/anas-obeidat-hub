const fs = require('fs');
const axios = require('axios');
const { getArticleBySlug, getAllArticles } = require('./src/lib/api/articles');

const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';
const API_KEY = '6ffaf73a-7157-4e51-a8d6-b78b362f275c:fx'; // Replace with your DeepL API key

async function translateText(text, targetLang) {
  if (!text) return '';
  try {
    const response = await axios.post(
      DEEPL_API_URL,
      {
        text: [text],
        target_lang: targetLang.toUpperCase(),
        auth_key: API_KEY,
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return response.data.translations[0].text;
  } catch (error) {
    console.error(`Error translating "${text}":`, error.message);
    return text;
  }
}

async function translateStaticJson() {
  try {
    const enTranslations = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));
    let arTranslations = {};

    if (fs.existsSync('src/locales/ar/translation.json')) {
      arTranslations = JSON.parse(fs.readFileSync('src/locales/ar/translation.json', 'utf8'));
    }

    async function translateObject(obj, target, prefix = '') {
      for (const key in obj) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'string') {
          if (!target[key] || target[key] === '') {
            target[key] = await translateText(obj[key], 'ar');
            console.log(`Translated "${newKey}": ${target[key]}`);
          } else {
            console.log(`Skipped "${newKey}": Already translated as "${target[key]}"`);
          }
        } else if (typeof obj[key] === 'object') {
          target[key] = target[key] || {};
          await translateObject(obj[key], target[key], newKey);
        }
      }
    }

    await translateObject(enTranslations, arTranslations);
    fs.writeFileSync('src/locales/ar/translation.json', JSON.stringify(arTranslations, null, 2));
    console.log('Static translation completed! Check src/locales/ar/translation.json');
  } catch (error) {
    console.error('Error during static translation:', error.message);
  }
}

async function translateDynamicArticles() {
  try {
    const articles = await getAllArticles();
    for (const article of articles) {
      const slug = article.slug;
      const enArticleTranslations = {
        title: article.title,
        description: article.description,
        content: article.content,
        requirements: article.requirements,
        useCases: article.useCases,
        libraries: article.libraries.map(lib => ({
          name: lib.name,
          description: lib.description,
        })),
      };

      let arArticleTranslations = {};
      const arFilePath = `src/locales/ar/articles/${slug}.json`;
      if (fs.existsSync(arFilePath)) {
        arArticleTranslations = JSON.parse(fs.readFileSync(arFilePath, 'utf8'));
      }

      async function translateArticleObject(obj, target) {
        for (const key in obj) {
          if (typeof obj[key] === 'string') {
            if (!target[key] || target[key] === '') {
              target[key] = await translateText(obj[key], 'ar');
              console.log(`Translated "${slug}.${key}": ${target[key]}`);
            } else {
              console.log(`Skipped "${slug}.${key}": Already translated as "${target[key]}"`);
            }
          } else if (Array.isArray(obj[key])) {
            target[key] = [];
            for (let i = 0; i < obj[key].length; i++) {
              if (typeof obj[key][i] === 'string') {
                target[key][i] = await translateText(obj[key][i], 'ar');
                console.log(`Translated "${slug}.${key}[${i}]": ${target[key][i]}`);
              } else if (typeof obj[key][i] === 'object') {
                target[key][i] = {};
                await translateArticleObject(obj[key][i], target[key][i]);
              }
            }
          } else if (typeof obj[key] === 'object') {
            target[key] = target[key] || {};
            await translateArticleObject(obj[key], target[key]);
          }
        }
      }

      await translateArticleObject(enArticleTranslations, arArticleTranslations);

      fs.mkdirSync('src/locales/en/articles', { recursive: true });
      fs.mkdirSync('src/locales/ar/articles', { recursive: true });
      fs.writeFileSync(`src/locales/en/articles/${slug}.json`, JSON.stringify(enArticleTranslations, null, 2));
      fs.writeFileSync(arFilePath, JSON.stringify(arArticleTranslations, null, 2));
      console.log(`Dynamic translation for ${slug} completed! Check src/locales/ar/articles/${slug}.json`);
    }
  } catch (error) {
    console.error('Error during dynamic translation:', error.message);
  }
}

async function translateAll() {
  await translateStaticJson();
  await translateDynamicArticles();
}

translateAll();