<p align="center">
  <img src="./pictures/logo.png" style="width:100px"><br>
  <strong>FINAL REPORT</strong>
</p>

***

<p align="center">
  <strong>Authors:</strong>
  <table align="center">
  <tr>
  <td><img src="https://avatars.githubusercontent.com/u/94459279?v=4" width="200px"></td>
  <td><img src="https://avatars.githubusercontent.com/u/102224204?v=4" width="200px"></td>
  <td><img src="https://avatars.githubusercontent.com/u/99322335?v=4" width="200px"></td>
  </tr>
  <tr>
  <td><a href="https://github.com/yhorm4884">Badel Bonilla Simón</a> <br> 💻 Programming</td>
  <td><a href="https://github.com/Miguelcg03">Miguel Carballo González</a> <br> 🌐 Deployment/Programming</td>
  <td><a href="https://github.com/Afe11ay">Afellay Ramos Luis</a> <br> 📖 Documentation</td>
  </tr>
  </table>
</p>

***

<p align="center">
  <strong>Date:</strong> May 1, 2024
</p>

<p align="center">
  <strong>Tutor:</strong>
  <table align="center">
  <tr>
  <td><img src="https://avatars.githubusercontent.com/u/58997290?v=4" width="200px"></td>
  </tr>
  <tr>
  <td><a href="https://github.com/amarzar">Alejandro Martín Zarza</a></td>
  </tr>
  </table>
</p>

<br>

<p align="center">
  <strong>INDEX</strong>
</p>

1. [***INTRODUCTION.***](#id1)
2. [***TECHNOLOGIES USED.***](#id2)
3. [***WEB STYLE GUIDE.***](#id3)
4. [***RESEARCH.***](#id4)
5. [***COPYRIGHT.***](#id5)
6. [***RISKS AND MEASURES.***](#id6)
7. [***DEGREE OF COMPLIANCE IN SCOPE.***](#id7)
8. [***DEGREE OF COMPLIANCE IN TIME.***](#id8)
9. [***DEGREE OF COMPLIANCE IN COST.***](#id9)
10. [***FINAL PRODUCT.***](#id10)
11. [***LEARNED EXPERIENCES TO BE CONSIDERED IN FUTURE PROJECTS.***](#id11)
12. [***CONCLUSIONS, COMMENTS, AND FINAL ASSESSMENT.***](#id12)

<br>
<br>

### 1. INTRODUCTION. <a name="id1"></a>

<div style="display: flex; align-items: center; justify-content: space-between;">
  <p style="flex: 1; text-align: justify; margin-right: 20px;">
    SportEvents is a web page we have designed to facilitate management for sports companies. Within these, it is possible to manage all current activities and clients in the company efficiently and quickly. We provide you with all the necessary tools to optimize your operations and offer the best experience to your clients.
  </p>
  <img src="https://octodex.github.com/images/scottocat.jpg" alt="calendar" style="flex-shrink: 0; width: 100px; height: 100px;">
</div>

### Main Features

- <p style="text-align: justify"><b>Activity Management:</b> Schedule and manage a wide variety of sports activities, from group classes to special events.</p>
- <p style="text-align: justify"><b>Scheduling:</b> Create and manage flexible schedules for your sports activities, allowing easy reservation and allocation of spaces.</p>
- <p style="text-align: justify"><b>Client Management:</b> Maintain a detailed record of your clients, including personal information, participation history, and preferences.</p>
- <p style="text-align: justify"><b>Integrated Communication:</b> Facilitate communication with your clients through integrated messaging and notification tools.</p>
- <p style="text-align: justify"><b>Reports and Analysis:</b> Access key data and metrics to assess your business performance and make informed decisions.</p>

<br>
<br>

### 2. TECHNOLOGIES USED. <a name="id2"></a>

#### Software Used:

##### Backend:

| Technology | Badge | Description |
|---|---|---|
| **Python 3.10.7** | ![Python Badge](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff&style=for-the-badge) | [Python 3.10.7](https://www.python.org/downloads/release/python-3107/): Programming language used to write the backend logic of the application. |
| **Django 5.0.4** | ![Django Badge](https://img.shields.io/badge/Django-092E20?logo=django&logoColor=fff&style=for-the-badge) | [Django 5.0.4](https://docs.djangoproject.com/en/5.0/releases/5.0.4/): High-level web development framework, used for building the backend part of the application (views, links, actions). |
| **Django REST Framework 3.15** | ![DjangoREST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray) | [Django REST Framework 3.15](https://www.django-rest-framework.org/community/release-notes/#315x-series): Library that facilitates the creation of RESTful APIs in Django. |
| **PostgreSQL 16.2** | ![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff&style=for-the-badge) | [PostgreSQL 16.2](https://www.postgresql.org/docs/16/release-16-2.html): Relational database management system, used as the main database. |
| **SQLite 3.45.3** | ![SQLite Badge](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=fff&style=for-the-badge) | [SQLite 3.45.3](https://www.sqlite.org/releaselog/3_45_3.html): Relational database management system, used as a development and testing database in the early stages of development. |
| **Stripe** | ![Stripe Badge](https://img.shields.io/badge/Stripe-626CD9?logo=stripe&logoColor=white&style=for-the-badge) | [Stripe](https://stripe.com): Payment platform used to manage secure and efficient online transactions. |

##### Frontend:

| Technology | Badge | Description |
|---|---|---|
| **React 18.2.0** | ![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=for-the-badge) | [React 18.2.0](https://legacy.reactjs.org/versions/): JavaScript library used for building the user interface. |
| **React Router 6.22.3** | ![React Router Badge](https://img.shields.io/badge/React%20Router-CA4245?logo=reactrouter&logoColor=fff&style=for-the-badge) | [React Router 6.22.3](https://reactrouter.com/en/6.22.0): Routing component for navigating between different views. |
| **Axios 1.6.8** | ![Axios Badge](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=fff&style=for-the-badge) | [Axios 1.6.8](https://www.npmjs.com/package/axios): HTTP client that has helped us make HTTP requests between the backend and frontend. |
| **Webpack 5.91.0** | ![Webpack Badge](https://img.shields.io/badge/Webpack-8DD6F9?logo=webpack&logoColor=000&style=for-the-badge) | [Webpack 5.91.0](https://www.npmjs.com/package/webpack): Module bundler used to compile and package the source code into JavaScript. |
| **Babel 7.24.4** | ![Babel Badge](https://img.shields.io/badge/Babel-F9DC3E?logo=babel&logoColor=000&style=for-the-badge) | [Babel 7.24.4](https://www.npmjs.com/package/@babel/core): Tool used to compile JavaScript code. |
| **MUI (Material-UI) 5.8.6** | ![MUI Badge](https://img.shields.io/badge/MUI-007FFF?logo=mui&logoColor=fff&style=for-the-badge) | [MUI 5.8.6](https://mui.com/): React component library for faster and easier development of attractive and professionally designed user interfaces. |

#### Necessary Hardware:

##### Server:
- **CPU**: A CPU with multiple cores and support for virtualization is recommended.
- **RAM**: We recommend a minimum of 8 GB of RAM, as React itself requires the installation of many packages and libraries.
- **Storage**: It's important to use SSD drives for faster speeds, with enough storage space for application files and the database.
- **Connectivity**: A high-speed internet connection is mandatory to handle user requests and actions as quickly as possible.

##### Network:
- The server should be configured to allow HTTP (port 80) and HTTPS (port 443) traffic to and from the server.
- A valid domain name should be configured with appropriate DNS records to allow users to access the application.

### 3. WEB STYLE GUIDE. <a name="id3"></a>

#### Design and Style
<table style="border: none">
  <tr>
    <td>
        The design of SportEvents is inspired by its <a src="documentation\Logo-SportEvents.webp"><b>logo</b></a>, using a color palette composed of blue, yellow, and black, which reflect energy, dynamism, and professionalism. The <b style="color: cyan">blue</b> conveys serenity and trust, essential for a management platform; the <b style="color: yellow">yellow</b> brings vitality and optimism, alluding to the sports energy; and the <b style="color: black">black</b> provides a strong contrast that accentuates the seriousness and focus of the platform.
    </td>
    <td>

![Logo Sports Events](./pictures/Logo-SportEvents.webp)
    </td>
  </tr>
</table>

#### Typography
- For texts, the <b>Betm-Black</b> font is used, a modern and bold typography that contributes to a strong and decisive visual appearance. This choice reinforces accessibility and readability across all user interfaces, ideal for highlighting headlines and key elements without sacrificing clarity.

#### User Interface (UI)
- We have a minimalist interface, avoiding visual overload and highlighting the most important elements using common colors and shapes. Additionally, we have a responsive design that will ensure a uniform experience both on mobile devices and computers.

#### User Experience (UX)
- The user experience is more fluid, as our application has a navigation structure that allows users to quickly find what they need. It is important to highlight that interactivity is a priority, as we have elements such as dynamic calendars and interactive forms for effective and effortless management.

#### Consistency
- The entire application will maintain aesthetic coherence with the logo and corporate colors, ensuring that users quickly identify and become familiar with the SportEvents brand.

### 4. RESEARCH. <a name="id4"></a>
#### Preliminary Research

<div style="display: flex; align-items: center; justify-content: space-between;">
  <p style="flex: 1; text-align: justify; margin-right: 20px;">
    The initial phase of the development of SportEvents involved exhaustive research to understand the current market needs, what clients and merchants are interested in, and how to profit from it. In this research, we examined various existing management systems, notable features of sports operations, and the end-users' expectations in terms of functionality, accessibility, and user experience.
  </p>
  <img src="https://octodex.github.com/images/inspectocat.jpg" alt="Inspectocat" style="flex-shrink: 0; width: 150px; height: 150px;">
</div>


#### Technologies and Tools

- Various technologies and frameworks were researched to select the most suitable for the project. For example, different solutions for the backend such as Node.js and Django were explored, evaluating their scalability, security, and ease of integration with other tools. For the frontend, frameworks such as React and Angular were considered, deciding on React due to its efficiency in updating user interfaces in real time and its vast developer community.
<img src="https://www.saaspegasus.com/static/images/web/modern-javascript/django-react-header.51a983c82dcb.png">

#### Challenges and Solutions
- During development, not everything worked on the first try. Some of the challenges included:

    - <b>Connection between Django and React:</b> Without much knowledge of how cookies worked between Django and React, we were overwhelmed because in certain browsers the cookies were not processed as they should have been, allowing access to content without the user's session being started.

    - <b>Learning between Django and React:</b> At first, we didn't know, but the only way we can communicate between React and Django is by making requests to the IPs that make the queries and always sending and receiving a JSON response.

#### Evaluation and Feedback
- Continuous testing was carried out, and feedback was collected from beta users to iterate on the development. This was crucial to discard some initial ideas and improve others, ensuring that the final application truly met user needs and enhanced the operational management of sports companies.

<hr>

 - The research and development of SportEvents have been a continuous learning, adaptation, and refinement process. Thanks to meticulous research and active user feedback, we have managed to create a solution that not only meets the technical requirements but also offers an exceptional user experience.


### 5. COPYRIGHT. <a name="id5"></a>

 At SportEvents, we take copyright management very seriously to ensure both legal operation and sustainable development of our platform. Here we detail how we manage both our own multimedia content and third-party software:

#### Self-Produced Multimedia Content

- **Images and Graphic Designs:**

  ![ChatGPT](https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white)</br> 
  Developed using advanced artificial intelligence tools like [OpenAI's GPT-4](https://openai.com/index/gpt-4). All graphics are shared under the [Creative Commons Attribution-ShareAlike (CC BY-SA) license](https://creativecommons.org/licenses/by-sa/4.0/deed.es), which allows their use and modification as long as appropriate recognition is provided and redistributed under the same license.

<br>

- **Promotional Videos:**</br> 
  [![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)</br> 
  Generated using artificial intelligence-based video technologies from OpenAI. Published under the same <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es">CC BY-SA license</a>, ensuring freedom of use as long as the corresponding credit is given and shared in the same way.

<br>

#### Third-Party Software and Libraries

- **React (JavaScript Library for User Interfaces):**  
  ![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=for-the-badge)  
  Used under the [MIT license](https://opensource.org/licenses/MIT), this license allows free use, copying, modification, and distribution of the software. React is widely recognized for its efficiency in creating dynamic interfaces.

- **Django (Web Development Framework):**  
  ![Django Badge](https://img.shields.io/badge/Django-092E20?logo=django&logoColor=fff&style=for-the-badge)  
  Operated under the [BSD license](https://opensource.org/licenses/BSD-3-Clause), which is highly flexible and allows virtually any use of the software, as long as the original authors are credited. Django is favored for its robustness and ease of use in building complex web applications.

- **Argon Design System React (Design System for React):**  
  ![Argon Badge](https://img.shields.io/badge/Argon_Design-00AAF2?logo=argon&logoColor=fff&style=for-the-badge)  
  Implemented under the [MIT license](https://opensource.org/licenses/MIT), Argon provides a rich environment for developers, offering access to an extensive range of stylized components and complete documentation, facilitating the development of attractive and coherent interfaces.

#### Justification for Use
Choosing materials under flexible licenses like MIT and BSD, along with the use of advanced technologies for content creation, reflects our commitment to scalability and innovation at SportEvents. We select tools and content not only for their technical excellence and functionality but also for the legal feasibility of their use, which allows us to easily adapt to future expansions and modifications.


### 6. RISKS AND MEASURES. <a name="id6"></a>

#### Identification of Risks 
- During the development of SportEvents, several technical and operational risks were identified. These included managing the loss of cookies in browsers, data security, and the integration of multiple third-party systems and technologies.

#### Issues and Implemented Solutions
1. <b>High-Concurrency Management:</b>
    - <b>Cookie Issues:</b> The system initially took a long time to load or did not load properly due to cookies.
    - <b>Measure:</b> A microservices architecture was implemented to improve scalability and load management. In addition, caching solutions were integrated, and database queries were optimized to reduce latency.

2. <b>Data Security:</b>
    - <b>Issue:</b> Vulnerabilities in the protection of personal and payment data, exposing the platform to security risks.
    - <b>Measure:</b> Security policies were strengthened, two-factor authentication was implemented, and regular security audits were conducted to identify and mitigate vulnerabilities.


#### Ongoing Risk Evaluation
- To ensure the ongoing resilience of SportEvents against emerging risks, a risk review process has been established that includes regular assessments, penetration testing, and stress simulations. This proactive approach helps identify and mitigate risks before they can significantly impact the operation of the service.

### 7. DEGREE OF COMPLIANCE IN SCOPE. <a name="id7"></a>

#### Evaluation of Compliance with Projected Functionalities
The development of SportEvents was planned with a set of key functionalities designed to optimize the management of sports companies. Below, we detail which of these functionalities have been successfully implemented and which have not, along with the reasons behind these outcomes.

#### Successfully Implemented Functionalities

| Number | Functionality                           | Status               | Description                                                                                                   | Justification                                                                                                                                                           |
|--------|-----------------------------------------|----------------------|---------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1      | Scheduling and Event Management           | Successfully implemented | Owners can create, modify, and delete schedules and sports events efficiently.        | This functionality was prioritized due to its central importance to the daily operation of sports companies.                                                      |
| 2      | Registration and Management of Clients   | Successfully implemented | Comprehensive system for registering clients and managing their data and activity history.                    | Implementation was facilitated using modern technologies that support secure and scalable data management.                                             |
| 3      | Online Reservation System            | Successfully implemented | Clients can book classes and events directly through the platform.                         | The integration of a real-time reservation system has significantly improved the user experience.                                                      |
| 4      | Online Payment Integration           | Successfully implemented | Enables online payment processing ensuring secure and efficient transactions.                                | These tools have provided valuable insights for strategic decision-making and continuous improvement.                                                   |

#### Non-Implemented Functionalities

| Number | Functionality         | Status         | Description                                                                                                  | Justification                                                                                                                                                           |
|--------|-----------------------|----------------|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1      | Direct Chat with Client | Not implemented | A functionality to allow real-time communication between clients and support or administration service. | Despite its initial planning, this functionality was postponed due to priorities in the development of other critical areas and resource limitations. It is a goal for future updates of the platform. |

#### Analysis and Future Projections
Although most of the essential and advanced functionalities have been successfully implemented, the implementation of direct chat with clients is a pending goal that is recognized as vital to further improving communication and client satisfaction. It is planned to address this functionality in the next development cycle.


### 8. DEGREE OF COMPLIANCE IN TIME. <a name="id8"></a>

#### Evaluation of Adherence to Projected Schedule
Compliance with established deadlines is crucial for the effective management of the SportEvents project. Below is a summary of the project phases, indicating their compliance and the relevant justifications.

#### Phases Completed According to Schedule

| Phase                                        | Compliance            | Justification |
|---------------------------------------------|-------------------------|---------------|
| Project Initiation and Requirements Definition | Completed on time | The initial phase was completed on time thanks to effective preparation and coordination among all teams involved. |
| Development of Main Functionalities (User Registration, Event Management) | Completed on time | The development of these key functionalities was meticulously planned, and additional resources were allocated to ensure their completion within the stipulated time. |
| Initial Testing and Beta User Feedback | Completed on time | The collection of feedback and testing was carried out as planned due to excellent responses from beta users and effective management of the testing process. |

#### Phases with Deviations from Planning

| Phase                                        | Compliance            | Justification | Badge |
|---------------------------------------------|-------------------------|---------------|-------|
| Online Payment Integration               | Slightly delayed   | Although successfully completed, this phase experienced a slight delay due to technical complexity and challenges in integrating Stripe for advanced data analysis and secure payments. | ![Stripe Badge](https://img.shields.io/badge/Stripe-626CD9?logo=stripe&logoColor=white&style=for-the-badge) |
| Implementation of Direct Chat with the Client | Not started            | This functionality was not started as planned due to prioritization of resources towards areas with greater immediate impact on user experience and platform operability. | ![LiveChat Badge](https://img.shields.io/badge/LiveChat-FF5100?logo=livechat&logoColor=fff&style=for-the-badge) |

#### Evaluation and Corrective Measures
To address deviations in the schedule, corrective measures have been taken including the reallocation of resources, process optimization, and the implementation of more efficient project management tools. Additionally, communication among teams has been increased to improve coordination and anticipate possible delays.

  
### 9. DEGREE OF COMPLIANCE IN COST. <a name="id9"></a>

#### Cost Control Strategies
- Despite the non-monetary budget, it was crucial to adopt management practices that maximized available resources and ensured compliance with project objectives without economic deviations. The following strategies were adopted:

  1. <b>Use of Free Technologies and Tools:</b>
      - We opted to use software and tools that offer free licenses for educational use or are open-source, such as React for the frontend, Django for the backend, and various libraries available under open licenses.
    
  2. <b>Collaboration and Shared Resources:</b>
      - Leveraging the academic networks available at our center, including test servers and access to specialized software at no additional cost.

  3. <b>Optimization of Time and Effort:</b>
      - A rigorous planning and a clear division of responsibilities were established to ensure team efficiency.
    
#### Actions to Detect and Correct Deviations
1. <b>Regular Monitoring Meetings:</b>
    - Weekly meetings are organized to review progress and adjust workload as needed, ensuring that the project progresses as planned without the need for additional resources.

2. <b>Continuous Testing and Feedback:</b>
    - Implementation of continuous testing and feedback cycles to detect errors and validate functionalities on time, helping to avoid rework that would consume more time and effort.

3. <b>Continuous Evaluation of Priorities:</b>
    - Constant prioritization of tasks based on their importance and feasibility within the context of time and available resources.

### 10.  CLAUSES. <a name="id10"></a>

#### Context of the Clauses

  |          Clause           |          Description        |            Measure           |
  |-----------------------------|-----------------------------|-----------------------------|
  |<b>Delay in Delivery Clause</b>|If the project is delayed and does not meet the requirements established in the academic schedule.|The team must notify the professor in advance, providing a detailed assessment of the causes of the delay and a revised plan for completion.|
  |<b>Quality and Review Clause</b>|How quality will be controlled and assured throughout the project's development.|The project will be subjected to periodic reviews by the professor, who will assess progress and adherence to academic standards of quality. Corrections and improvements suggested should be implemented as indicated by the evaluations.|
  |<b>Contribution of Team Members Clause</b>|How the contribution of each team member will be managed to ensure equity and avoid imbalances in the workload.|Each team member is required to document their contributions and participate equitably in all phases of the project. Individual performance evaluations will be part of the final project assessment.|
  |<b>Use of External Resources Clause</b>|Use of copyrighted material, paid software, or any other resource that may have legal or ethical implications.|All material and software used must comply with appropriate licenses and, in the case of academic resources, must be used exclusively under the terms permitted. |

### 11.  FINAL PRODUCT. <a name="id11"></a>

#### Description of the Final Product
- SportEvents is a web platform designed to efficiently manage sports companies, allowing comprehensive management of schedules, activities, and clients. The interface is intuitive and accessible, optimized for both mobile devices and desktops, ensuring a fluid and consistent user experience.

#### Basic General Usage Manual
  1. Access SportEvents and log in or register if you do not have an account on our website.
  2. Once you have accessed, you can navigate to your `Profile` by selecting the "hamburger" menu located at the top right of the web, and here we access `Profile`.
  3. Here you can update your personal information, as well as your profile picture by clicking on the button with a pencil symbol.

#### Basic Usage Manual as a Client
  1. If you are a user of our website, and want to join a sports company, you must go to the home page of your profile by selecting the "hamburger" menu located at the top right of the web, and here we access `Home`.
  2. Here in the section of available companies you will be able to see all the public companies available on the web. Once you have found the desired company, you must click on it, here a box will appear about the information of the same, in addition to a button that will say if you want to join the company.
  By clicking on this button, a request will be sent to the businessman so that he can accept or not.
  3. Once the businessman has accepted the request, if we access the `Available Activities` tab located at the start of our profile, we will be able to see all the activities that belong to us.

#### Basic Usage Manual as Owner
  1. If you are a user of our website, but want to add your company to our website, you must access the start of your profile by selecting the "hamburger" menu located at the top right of the web, and here we access `Home`.
  2. Once here, a message will appear in the lower right part of the web indicating that we click on it if we are owners of a company or want to be. We click on it.
  3. Upon accessing here, three different payment plans will appear that you must evaluate and subsequently pay to proceed in the process.
  4. Once you have paid, you will have the option to create the company with a unique entry code.
  5. At the end of the process, you will have been redirected to your company, where an option of `Profile` and `Company Manager` will appear.
  6. If we access `Profile`, we will be able to edit our profile as the owner of the company, in the same way that the client's works.
  7. If we access `Company Manager`, we will be able to edit the company's information, in addition to being able to create, edit or delete any activity of this.
  On the other hand, you will also be able to manage the company's users as well as access the notifications of this, where we can accept or reject the users' requests to join the company.
    
### 12.  LEARNED EXPERIENCES TO BE CONSIDERED IN FUTURE PROJECTS. <a name="id12"></a>
- Throughout the development of SportEvents, the team has acquired valuable experiences that will be crucial for continuous improvement and effectiveness in future projects. Below, some of the most important lessons learned are listed:
</br>

|       Title            |             Lesson            |             Future Application            |
|-------------------------|--------------------------------|------------------------------------------|
| <b>Planning and Time Management</b> | The importance of detailed planning. | Implement project management techniques such as the Scrum method to improve planning.   |
| <b>Collaboration and Communication</b> | Effective communication is essential.       | Foster an environment where regular meetings and status updates are the norm.    |
| <b>Use of Technology and Tools</b> | Proper technology selection is critical. | Conduct a thorough evaluation of tools before deciding which ones to implement.           |
| <b>Risk Management</b> | Underestimated risks can negatively impact. | Develop and maintain a dynamic risk management plan that is reviewed and updated regularly.    |
| <b>Testing and Quality</b> | Exhaustive testing is crucial.         | Integrate testing at every development stage, using both automatic and manual testing methodologies.    |


### 13.  CONCLUSIONS, COMMENTS, AND FINAL ASSESSMENT. <a name="id13"></a>
#### General Conclusion of the Project

- SportEvents has been a challenging project, designed to facilitate the management of sports companies through an intuitive and multifunctional platform. The development of the project allowed the team to face and overcome various technical and management challenges, which resulted in a robust product that meets the basic needs of our target users and provides a solid foundation for future expansions.

#### Comments on Development

- The development process of SportEvents has highlighted the importance of detailed planning and adaptability in project management. Collaboration within the team was crucial to overcome obstacles and to implement different solutions that suited the project's requirements. The use of modern and open-source technologies not only facilitated efficient implementation but also kept operational costs to a minimum, which was essential given the budget.

#### Assessment of Implemented Functionalities

- All the main functionalities, such as event management, client registration, online reservation system, and payment integration, were successfully implemented and have functioned according to expectations.

#### Learned Lessons

- The lessons learned during this project have been several and of great value. The importance of conducting thorough tests, the need for effective communication within the team, and adapting to real-time feedback are aspects that will be carried into future projects. The experience has shown how adaptability can be crucial when facing unexpected challenges.

#### Future Perspectives

- Looking ahead, there is clear potential to expand SportEvents, not only in terms of new functionalities but also in the scalability of the platform to handle a larger number of users and more complex operations. The experience gained and the technological infrastructure already established provide an excellent foundation for these developments.

#### Final Conclusion

- SportEvents is a testament to what a committed and motivated team can achieve, even with limited resources. This project not only met its initial objectives but also provided significant learning and established a solid foundation for future professional and academic challenges.
