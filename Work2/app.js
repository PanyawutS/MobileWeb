const app = Vue.createApp({
    data() {
        return {
            quizStarted: false,
            quizCompleted: false,
            score: 0,
            answers: [],
            questions: [],
            quizTitle: 'แบบทดสอบทั่วไป'
        };
    },
    methods: {
        async startQuiz() {
            // โหลดคำถามจาก JSON
            try {
                const response = await fetch('questions.json');
                const data = await response.json();
                this.questions = data.questions;
                this.quizStarted = true;
                this.answers = Array(this.questions.length).fill(null);
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการโหลดคำถาม:', error);
            }
        },
        checkAnswers() {
            this.score = this.questions.reduce((total, question, index) => {
                return total + (this.answers[index] === question.answer ? 1 : 0);
            }, 0);
            this.quizCompleted = true;
        }
    }
});

app.use(Vuetify.createVuetify());
app.mount('#app');
