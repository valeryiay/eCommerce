<template>
    <v-container class="wrapper-container">
        <v-row class="equal-height-cards">
            <v-col>
                <v-card elevated hover class="v-card-profile d-flex flex-column align-center pa-5 rounded-lg">
                    <v-card-title class="text-center">Valeryia Yarash</v-card-title>
                    <v-card-subtitle class="text-center">Job title</v-card-subtitle>
                    <v-card-text class="card-text">
                        Valeryia was instrumental in shaping the visual identity of our project.
                        She created a comprehensive Figma layout, which served as the blueprint for all our designs.
                        Her work ensured a consistent and intuitive user experience across the application.
                        For our eCommerce Single Page Application (SPA),
                        Valeryia designed and developed the Main Page, Catalogue/Product Page, and (Page from Sprint 4).
                        Her design expertise transformed our vision into a functional and aesthetically pleasing reality.
                    </v-card-text>
                    <v-card-text class="card-text">
                        Valeryia's ability to translate ideas into beautiful,
                        functional designs was crucial to our project's success.
                        Her collaborative approach and attention to user experience helped
                        us create a cohesive and engaging product.
                        Valeryia's contributions not only enhanced the visual appeal of our application
                        but also played a vital role in achieving our project goals.

                        <p class="text-center px-5 pt-5">Want to see more? Catch us on:</p>
                    </v-card-text>
                    <v-row>
                        <v-avatar size="100" class="pa-5">
                            <img
                                height="100%"
                                min-width="75"
                                src="@/assets/img/github2.svg"
                                alt="Github logo"
                            >
                        </v-avatar>
                        <v-avatar size="100" class="pa-5">
                            <img
                                height="100%"
                                min-width="75"
                                src="@/assets/img/linkedin.svg"
                                alt="LinkedIn Logo"
                            >
                        </v-avatar>
                    </v-row>
                </v-card>
            </v-col>
            <v-col>
                <v-card elevated hover class="v-card-profile d-flex flex-column align-center pa-5 rounded-lg">
                    <v-avatar size="200" class="mb-4 mt-2">
                        <img
                            height="100%"
                            min-width="100"
                            src="@/assets/img/vitalii.jpeg"
                            alt="Portrait photo"
                        >
                    </v-avatar>
                    <v-card-title class="text-center">Vitaly Dushkin</v-card-title>
                    <v-card-subtitle class="text-center">Software Engineer</v-card-subtitle>
                    <v-card-text class="card-text">
                        Vitaly spearheaded our technical endeavors,
                        bringing a wealth of expertise and precision to the project.
                        With a robust background in software development,
                        he ensured that our technical foundation was both strong and scalable.
                        Vitaly played a pivotal role in our project by integrating essential tools such as Vitest for testing.
                        He also automated our workflow using GitHub Actions,
                        significantly streamlining our development process.
                        In our SPA, Vitaly made significant
                        contributions by developing the Registration Page, User Profile Page, and (Page of Sprint 4).
                    </v-card-text>
                    <v-card-text class="card-text">
                        Vitaly ensured our CI/CD pipeline was smooth and efficient,
                        preventing any bottlenecks in development.
                        His technical skills and problem-solving abilities kept the project on track.
                        Vitaly’s contributions were crucial in meeting all project milestones and delivering a successful application.

                        <p class="text-center px-5 pt-5">Want to see more? Catch us on:</p>
                    </v-card-text>
                    <v-row>
                        <a href="https://github.com/vetalapo" target="_blank">
                            <v-avatar size="100" class="pa-5">
                                <img
                                    height="100%"
                                    min-width="75"
                                    src="@/assets/img/github2.svg"
                                    alt="Github logo"
                                >
                            </v-avatar>
                        </a>
                    </v-row>
                </v-card>
            </v-col>
            <v-col>
                <v-card elevated hover class="v-card-profile d-flex flex-column align-center pa-5 rounded-lg">
                    <v-avatar size="200" class="mb-4 mt-2">
                        <img
                            height="100%"
                            min-width="100"
                            src="@/assets/img/joelle.jpeg"
                            alt="Portrait photo"
                        >
                    </v-avatar>
                    <v-card-title class="text-center">Joëlle Marianek</v-card-title>
                    <v-card-subtitle class="text-center">Student</v-card-subtitle>
                    <v-card-text class="card-text">
                        Joelle was responsible for researching and setting up our project management tool,
                        as well as establishing meeting protocols.
                        Her organizational skills ensured that our project stayed on schedule
                        and all team members were aligned.
                        In our SPA, Joelle made significant contributions by developing the Login Page, Detailed Product Page,
                        and the About Us Page. Her work provided essential functionalities and a seamless user experience.
                    </v-card-text>
                    <v-card-text class="card-text">
                        Joelle’s effective project management ensured smooth coordination
                        and timely progress throughout the project.
                        Her strategic planning and implementation of protocols
                        kept the team focused and productive.
                        Joelle’s contributions were vital in delivering a well-structured and successful application.

                        <p class="text-center px-5 pt-5">Want to see more? Catch us on:</p>
                    </v-card-text>
                    <v-row>
                        <a href="https://github.com/JoMarianek" target="_blank">
                            <v-avatar size="100" class="pa-5">
                                <img
                                    height="100%"
                                    min-width="75"
                                    src="@/assets/img/github2.svg"
                                    alt="Github Logo"
                                >
                            </v-avatar>
                        </a>
                        <a href="https://www.linkedin.com/in/joelle-marianek-0b604a123/" target="_blank">
                            <v-avatar size="100" class="pa-5">
                                <img
                                    height="100%"
                                    min-width="75"
                                    src="@/assets/img/linkedin.svg"
                                    alt="LinkedIn Logo"
                                >
                            </v-avatar>
                        </a>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card flat class="footer d-flex flex-column align-center pa-5 rounded-lg">
                    <v-card-text class="card-text text-center">
                        This project was developed during the Frontend Course of Rolling Scopes. Read about the school here:
                    </v-card-text>
                    <v-row>
                        <a href="https://rs.school/" target="_blank">
                            <v-avatar size="100" class="pa-2">
                                <img
                                    height="100%"
                                    src="@/assets/img/rs-school-logo.svg"
                                    alt="Rolling Scopes Logo"
                                >
                            </v-avatar>
                        </a>
                        <a href="https://github.com/rolling-scopes-school" target="_blank">
                            <v-avatar size="98" class="pa-2">
                                <img
                                    height="100%"
                                    src="@/assets/img/github2.svg"
                                    alt="Github Logo"
                                >
                            </v-avatar>
                        </a>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
    .wrapper-container {
        overflow-x: hidden;
        max-width: 1600px;
        min-width: 100vw;
        min-height: 100vh;
        font-family: Poppins, sans-serif;
        background: url("../assets/img/backgroundRegistration.png") center / cover no-repeat;
    }

    .card-text {
        font-size: 18px;
        text-align: justify;
    }

    .equal-height-cards {
        display: flex;
        flex-wrap: wrap;
        padding-left: 160px;
        padding-right: 165px;
    }

    .v-card-profile {
        min-height: 1179px;
        height: auto;
    }

    p {
        font-size: 18px;
    }

    .footer {
        height: auto;
    }
</style>