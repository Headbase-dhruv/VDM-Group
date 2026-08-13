document.addEventListener('alpine:init', () => {
    Alpine.data('counter', target => ({
        count: 0,

        start() {
            const step = target / 50;

            const interval = setInterval(() => {
                this.count = Number((this.count + step).toFixed(1));

                if (this.count >= target) {
                    this.count = target;
                    clearInterval(interval);
                }
            }, 20);
        }
    }));
});

// assets/js/script.js
document.addEventListener('alpine:init', () => {
    Alpine.data('scrollSpy', ({ line = 50, smooth = true } = {}) => ({
        active: 0,
        buttons: [],
        sections: [],
        observer: null,

        init() {
            this.buttons = Array.from(this.$el.querySelectorAll('button'));
            this.sections = Array.from(document.querySelectorAll('[data-section]'));

            this.buttons.forEach((button, i) => {
                button.addEventListener('click', () => {
                    this.sections[i]?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
                });
            });

            this.$watch('active', i => {
                this.buttons.forEach((button, index) => {
                    button.classList.toggle('active', index === i);
                    button.setAttribute('aria-current', index === i ? 'true' : 'false');
                });
            });

            this.observer = new IntersectionObserver(
                entries => entries.forEach(entry => {
                    if (entry.isIntersecting) this.active = this.sections.indexOf(entry.target);
                }),
                { rootMargin: `-${line}% 0px -${100 - line}% 0px` }
            );

            this.sections.forEach(section => this.observer.observe(section));
            this.buttons[0]?.classList.add('active');
        },

        destroy() {
            this.observer?.disconnect();
        },
    }));
});