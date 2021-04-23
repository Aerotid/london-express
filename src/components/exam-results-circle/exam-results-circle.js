import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import Swiper from 'swiper/dist/js/swiper.min';

class ExamResultsCircle extends Component {
    constructor(nRoot) {
        super(nRoot, 'exam-results-circle');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        const self = this;

        this.nPoints = this.nFindSingle('points');
        this.nMarkCircle = this.nFindSingle('circle-dynamic').querySelector('circle');
        this.bigRadius = this.nMarkCircle.r.baseVal.value;
        this.bigCircumference = 2 * Math.PI * this.bigRadius;
        this.nMarkCircle.style.strokeDasharray = `${this.bigCircumference} ${this.bigCircumference}`;

        this.animateCircle = this.animateCircle.bind(this);
        this.animateIndividualCircle = this.animateIndividualCircle.bind(this);
        this.getStudentsPoints = this.getStudentsPoints.bind(this);

        this.nStudents = [...this.nFind('student')];
        this.nStudentCircles = this.nStudents.map((student) => student.querySelector('.exam-results-circle__sm-circle-dynamic circle'));
        this.radius = this.nStudentCircles[0].r.baseVal.value;
        this.circumference = 2 * Math.PI * this.radius;
        this.nStudentCircles.forEach((circle) => circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`);

        this.nStudents.forEach((student, index) => {
            student.addEventListener('click', () => {
                student.classList.add('clicked');
                self.nStudents.forEach((stud, i) => {
                    if (i === index) return;
                    stud.classList.remove('clicked');
                });

                const percentage = student.dataset.points;
                const tl = new TimelineLite();
                this.animateCircle(self.nMarkCircle, this.bigCircumference, percentage, tl);

                const pointsHolder = { points: Number(self.nPoints.innerHTML) };
                tl.to(pointsHolder, 1, {
                    points: percentage,
                    roundProps: 'points',
                    onUpdate: () => {
                        self.nPoints.innerHTML = pointsHolder.points;
                    },
                }, 0);

                this.animateIndividualCircle(index, this.circumference, percentage, tl);
            });
        });

        this.nStudents[0].click();

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);
    }

    getStudentsPoints(index) {
        return this.nStudents[index].dataset.points;
    }

    animateCircle(circle, circumference, percentage, timeLine) {
        const offset = circumference - percentage / 100 * circumference;
        if (timeLine) { timeLine.to(circle, 1, { strokeDashoffset: offset, autoRound: false }, 0); } else new TimelineLite().to(circle, 1, { strokeDashoffset: offset }, 0);
    }

    animateIndividualCircle(circleIndex, circumference, percentage) {
        const avatarCircle = this.nStudentCircles[circleIndex];
        this.animateCircle(avatarCircle, circumference, percentage);
        this.nStudentCircles.forEach((circle, i) => {
            if (i === circleIndex) return;
            new TimelineLite().to(circle, 1, { strokeDashoffset: 2 * Math.PI * avatarCircle.r.baseVal.value, autoRound: false }, 0);
        });
    }

    initDesktop() {
        this.swiperStudents = new Swiper('.swiper-container-students', {
            slidesPerView: 4,
            spaceBetween: 50,
            direction: 'vertical',
            slideClass: 'swiper-student',
            wrapperClass: 'swiper-wrapper-students',
        });
    }

    initMobile() {
        this.swiperStudents = new Swiper('.swiper-container-students', {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 30,
            direction: 'horizontal',
            slideClass: 'swiper-student',
            wrapperClass: 'swiper-wrapper-students',
        });

        let animate = this.animateIndividualCircle;
        let points = this.getStudentsPoints;
        const circ = this.circumference;
        points = points.bind(this);
        animate = animate.bind(this);

        this.swiperStudents.on('slideChangeTransitionEnd', function () {
            animate(this.realIndex, circ, points(this.realIndex));
        });
    }

    afterResize() {
        if (getDeviceType() !== this.currentDevice) {
            if (getDeviceType() === 'mobile') {
                this.destroyDesktop();
                this.initMobile();
            } else if (this.currentDevice === 'mobile') {
                this.destroyMobile();
                this.initDesktop();
            }
            this.currentDevice = getDeviceType();
        }
    }

    destroyDesktop() {
        if (this.swiperStudents) this.swiperStudents.destroy();
    }

    destroyMobile() {
        if (this.swiperStudents) this.swiperStudents.destroy();
    }

    destroy() {
        if (this.swiperStudents) this.swiperStudents.destroy();
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default ExamResultsCircle;
