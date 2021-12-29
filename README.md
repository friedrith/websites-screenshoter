# Websites Screenshoter

This repository contains the code to capture screenshots from websites automatically. 
It generates a list of websites to scrap then for each website, take a screenshot. This tool has been created for the purpose of an academic paper: [The Effect of Increased Body Motion in Virtual Reality on a Placement-Retrieval Task](https://doi.org/10.1145/3489849.3489888).

It was inspired by another academic paper: [Data Mountain:
Using Spatial Memory for Document Management](https://doi.org/10.1145/288392.288596).

## Getting started

This project is using node.js

1. install dependencies with `yarn`
1. write a config file _config/config.yaml_ (you can use _config/config.example.yaml_ as example)
3. generate list of websites to scrap: `yarn generate:list`
4. generate screenshots: `yarn generate:screenshots`


## Bibliography

- Thibault Friedrich, Arnaud Prouzeau, and Michael McGuffin. 2021. The Effect of Increased Body Motion in Virtual Reality on a Placement-Retrieval Task. In Proceedings of the 27th ACM Symposium on Virtual Reality Software and Technology (VRST '21). Association for Computing Machinery, New York, NY, USA, Article 14, 1–5. DOI:https://doi.org/10.1145/3489849.3489888
- George Robertson, Mary Czerwinski, Kevin Larson, Daniel C. Robbins, David Thiel, and Maarten van Dantzich. 1998. Data mountain: using spatial memory for document management. In Proceedings of the 11th annual ACM symposium on User interface software and technology (UIST '98). Association for Computing Machinery, New York, NY, USA, 153–162. DOI:https://doi.org/10.1145/288392.288596

