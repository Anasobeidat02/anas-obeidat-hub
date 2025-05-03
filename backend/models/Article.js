const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String
  }
});

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  requirements: [String],
  useCases: [String],
  libraries: [librarySchema],
  language: {
    type: String,
    required: true
  },
  icon: {
    type: String
  },
  color: {
    type: String,
    default: 'blue'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from title before saving
articleSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    // تعيين قيم slug مخصصة لبعض العناوين
    const specialCases = {
      'C++': 'cpp',
      'C#': 'csharp'
    };

    // استخدام القيمة المخصصة إذا وجدت، وإلا تحويل العنوان
    this.slug = specialCases[this.title] || this.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '-') // استبدال الأحرف غير الأبجدية بالشرطة
      .replace(/\s+/g, '-') // استبدال المسافات بالشرطة
      .replace(/-+/g, '-'); // إزالة الشرطات المتكررة
  }
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;