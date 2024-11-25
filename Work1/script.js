$(document).ready(function () {
    let questions = [];
    let currentAnswers = [];
    let userAnswers = [];

    // โหลดคำถามจากไฟล์ JSON
    $.getJSON('questions.json', function (data) {
        questions = data.questions;
    });

    // เริ่มทำแบบทดสอบ
    $('#start-quiz').click(function () {
        $('#start-screen').addClass('hidden');
        $('#quiz-screen').removeClass('hidden');

        currentAnswers = questions.map(q => q.answer);
        userAnswers = Array(questions.length).fill(null);

        // แสดงคำถาม
        questions.forEach((q, i) => {
            $('#quiz-questions').append(`
                <div class="mb-4">
                    <p class="fw-bold">${i + 1}. ${q.question}</p>
                    ${q.options.map((option, index) => `
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="q${i}" value="${option}" id="q${i}-${index}">
                            <label class="form-check-label" for="q${i}-${index}">
                                ${option}
                            </label>
                        </div>
                    `).join('')}
                </div>
            `);
        });

        $('#submit-quiz').removeClass('hidden');
    });

    // ตรวจคำตอบ
    $('#submit-quiz').click(function () {
        $('input:checked').each(function (index) {
            userAnswers[index] = $(this).val();
        });

        let score = 0;
        userAnswers.forEach((answer, i) => {
            if (answer === currentAnswers[i]) score++;
        });

        $('#quiz-screen').addClass('hidden');
        $('#result-screen').removeClass('hidden');
        $('#score').text(score);
    });

    // เริ่มใหม่
    $('#restart-quiz').click(function () {
        $('#result-screen').addClass('hidden');
        $('#start-screen').removeClass('hidden');
        $('#quiz-questions').empty();
        $('#submit-quiz').addClass('hidden');
    });
});
