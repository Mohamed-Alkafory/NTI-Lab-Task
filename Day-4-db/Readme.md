# 🗂️ MongoDB Cheat Sheet — مذكرة شخصية للمراجعة

## ⚙️ التشغيل (Offline)
```bash
# نافذة 1: تشغيل السيرفر
cd "C:\Program Files\MongoDB\Server\8.3\bin"
.\mongod.exe --dbpath "C:\data"

# نافذة 2: تشغيل الشِل
cd "C:\Program Files\MongoDB\Server\8.3\bin"
.\mongosh.exe
```
⚠️ لازم mongod يفضل شغال في نافذة منفصلة طول الوقت اللي بتستخدم فيه mongosh.

---

## 🗄️ الداتابيز (Database)
```js
use myDB                 // يدخلك/ينشئ الداتابيز (لسه مش هتتحفظ غير بعد أول insert)
db                        // يعرض اسم الداتابيز الحالية
show dbs                  // يعرض كل الداتابيزات المحفوظة فعلياً
db.dropDatabase()         // يمسح الداتابيز الحالية بالكامل
```

## 📁 الـ Collection
```js
db.createCollection("students")   // إنشاء صريح (مش لازم، بيتعمل تلقائي مع أول insert)
show collections                   // عرض كل الـ collections في الداتابيز الحالية
db.students.drop()                 // مسح الـ collection بالكامل (وindexاتها معاها)
```

---

## ➕ Insert (إضافة بيانات)
```js
db.students.insertOne({ FirstName: "Ahmed", Age: 22 })

db.students.insertMany([
  { FirstName: "Sara", Age: 20 },
  { FirstName: "Mohamed", Age: 19 }
])
```
📌 مش محتاج تعمل الـ collection الأول — الـ insert بيعملها لوحده لو مش موجودة.

---

## 🔍 Find (استعلامات)
```js
db.students.find()                          // كل الـ documents
db.students.find().pretty()                 // بشكل منسّق

db.students.find({ FirstName: "Ahmed" })    // مطابقة مباشرة (equality)

db.students.findOne({ FirstName: "Ahmed" }) // أول نتيجة بس
```

### Projection (تحديد الحقول اللي تتعرض)
```js
db.students.find(
  { FirstName: "Ahmed" },
  { FirstName: 1, LastName: 1, _id: 0 }   // 1 = اظهر / 0 = اخفي
)
```

### Pagination & Sort
```js
db.students.find().limit(5)                 // أول 5 بس
db.students.find().limit(5).skip(10)        // تخطي أول 10 وهات اللي بعدهم
db.students.find().sort({ Age: 1 })         // تصاعدي (1) / تنازلي (-1)
```

---

## 🧮 Comparison Operators (مشغلات المقارنة)
| Operator | المعنى |
|---|---|
| `$eq` | يساوي |
| `$ne` | لا يساوي |
| `$lt` | أقل من |
| `$lte` | أقل من أو يساوي |
| `$gt` | أكبر من |
| `$gte` | أكبر من أو يساوي |
| `$in` | ضمن قائمة قيم |
| `$nin` | مش ضمن قائمة قيم |

```js
db.students.find({ Age: { $lt: 21 } })
db.students.find({ Grade: { $in: [70, 80, 90] } })
```

## 🔗 Logical Operators (مشغلات منطقية)
```js
// OR
db.students.find({
  $or: [ { FirstName: "Ahmed" }, { LastName: "Ahmed" } ]
})

// AND
db.students.find({
  $and: [ { Age: { $gte: 21 } }, { Faculty: { $ne: null } } ]
})
```

---

## ✏️ Update (تعديل)
```js
// $set: يعدل حقل معين ويسيب الباقي زي ما هو
db.students.updateOne(
  { FirstName: "Ahmed" },
  { $set: { LastName: "NewLastName" } }
)

db.students.updateMany(
  { FirstName: "Ahmed" },
  { $set: { Age: 25 } }
)

// $inc: زيادة/نقصان رقم
db.students.updateOne({ _id: 1 }, { $inc: { Age: 1 } })

// $unset: مسح حقل بالكامل من الـ document
db.students.updateOne({ FirstName: "Ahmed" }, { $unset: { Age: "" } })

// $push: إضافة عنصر لمصفوفة (array)
db.students.updateOne(
  { FirstName: "Ahmed" },
  { $push: { Skills: "MongoDB" } }
)

// $push مع أكتر من عنصر
db.students.updateOne(
  { FirstName: "Ahmed" },
  { $push: { Skills: { $each: ["Node.js", "Express"] } } }
)
```

---

## ❌ Delete (حذف)
```js
db.students.deleteOne({ FirstName: "Ahmed" })   // يمسح أول نتيجة تطابق بس
db.students.deleteMany({ IsFired: true })       // يمسح كل اللي يطابقوا الشرط
db.students.deleteMany({})                      // يمسح كل الـ documents (الـ collection تفضل موجودة فاضية)
```

---

## 📇 Index
```js
db.students.createIndex({ FirstName: 1 })              // Single field
db.students.createIndex({ FirstName: 1, Age: -1 })      // Compound index

db.students.getIndexes()          // عرض كل الـ indexes
db.students.dropIndex("FirstName_1")
db.students.dropIndexes()          // مسح كل الـ indexes ما عدا الافتراضي
```
📌 الـ Index بيسرّع البحث على الحقل ده، بدل ما MongoDB يعمل مسح كامل (collection scan).

---

## 🧠 ملاحظات سريعة (Quick Notes)
- الـ Document = صف (Row) في SQL، لكنه مرن ومش لازم كل الـ documents يكون ليها نفس الحقول.
- الـ Nested Object (زي `Faculty: {Name, Address}`) بيسمحلك تحط بيانات مرتبطة جوا نفس الـ document من غير Join.
- الـ Array of Objects (زي `Grades: [...]`) بيسمحلك تخزن أكتر من عنصر مرتبط بنفس الطالب.
- `1` في projection/sort = اظهر/تصاعدي | `0`/`-1` = اخفي/تنازلي (خد بالك مش نفس المعنى في السياقين).
