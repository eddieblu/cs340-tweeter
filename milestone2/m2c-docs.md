# M2C Documents

## Question 1: M2A, MVP, UML class diagram, UML sequence diagram

1 . Which types (classes, interfaces, react components) play each of the key roles in the pattern (model, view, presenter)? How are those types related in your design and how was the observer design pattern used?

In the Tweeter app, the Model–View–Presenter (MVP) pattern is implemented with the Service classes (`UserService`, `StatusService`, `FollowService`) as the Model, the React components and hooks in `src/components/` as the View, and the Presenter classes in `src/presenters/` (*see UML class diagram UserNavPresenter*) as the Presenter. The View passes user actions to the Presenter, which interacts with the Model and updates the View in return. The Observer pattern is used in the connection between the Presenter and View: the View registers itself as a listener when creating the Presenter, and the Presenter notifies the View of updates by calling its methods (like `setDisplayedUser`, `navigate`, or `displayErrorMessage`), allowing the UI to react to changes without containing business logic.

2 . In brief what are 2 or 3 reasons why the MVP pattern is an effective choice for your design? You may want to refer to your diagram to support your reasoning.

The MVP pattern is effective because it keeps the View simple and easy to read while separating business and server logic into the Presenter and Service classes. As shown in the sequence diagram, the View only calls the Presenter and waits for updates, while the Presenter alone interacts with the Model. I like that someone reading the code can quickly understand what the View does and see the business logic by reference through the presenter, and that the View interface cleanly handles communication back and forth—even if the observer pattern behind it is a bit confusing, it clearly works well.

**UML Class Diagram -- UserNav**

<img src="UserNav-UML-class-diagram.png" width="500"/>

<br>

**UML Sequence Diagram**

```sql
User           useNavigateToUser (View)       UserNavPresenter          UserService
 |                     |                            |                        |
 |  click event        |                            |                        |
 |-------------------->|                            |                        |
 |                     | navigateToUser(event)      |                        |
 |                     |--------------------------->|                        |
 |                     |                            | extractAlias(...)      |
 |                     |                            |----------------------->|
 |                     |                            |<-----------------------|
 |                     |                            | getUser(authToken, alias)
 |                     |                            |----------------------->|
 |                     |                            |        return User     |
 |                     |                            |<-----------------------|
 |                     |                            | setDisplayedUser(toUser)
 |                     |<---------------------------|                        |
 | update displayed UI |                            |                        |
 |-------------------->|                            |                        |
 |                     | navigate(toUser)           |                        |
 |<--------------------|                            |                        |
```



## Question 2: M2B, template method pattern, 2 UML class diagram

Select one part of your code where the template method pattern was used and answer the following questions based on your design. 

Please include two simple UML class diagrams to help illustrate your answers. 
- to capture the design before the template method pattern was introduced 
- to capture the design after the template method pattern was introduced

1. Which classes play each of the key roles in the pattern? Describe the relationship between the classes and how they work together (including explaining what behavior is in the super class and what behavior is deferred to the subclasses).
2. Explain how the template method pattern allowed you to reduce code duplication. Please be specific and refer to the accompanying UML class diagrams as needed.
