# Employee Training Tracker
The Employee Training Tracker was started as an internal project here at FineLine Prototyping as part of our ISO 9001:2008 certification.

We decided to release the source for this application for a couple of reasons.  We wanted to share with others how
we have integrated AngularJS and Rails which uses several other gems that we've released separately.  We also think that
other people may actually find the training tracking tool useful.

## Disclaimers
This app is very much still under construction.

The application should function in its current state but it's not what we would call ready for production.

Our internal version of this application was tied into other systems and integrated into a larger Rails application and we
have not had time to flesh out the security for the open source version.  We did add Devise for basic login authentication
but we didn't do any work to tie it into AngularJS or to customize the look and feel.

This was our first Rails and AngularJS app and it started out mainly as a proof of concept so we are pretty light on tests at the moment.

## Installation
See [Development](#development) for information on getting the development version up and running.

## Development
There shouldn't be too much for you to do to get this up and running if you are familiar with Rails.  We have development
configured to use sqlite3 and we created some sample seed data.

From the project directory run the following:

    bundle install
    rake db:migrate
    rake db:seed
    rails server -p 3000 -e development

After the rails server is running you can access [http://localhost:3000] and it get a Devise login page.  The seed data
sets up a user named user@example.com with a password of "password" (without the quotes).

We include [ActiveAdmin][aa] at [http://localhost:3000/admin] so you can edit the data available.
The seed data sets up an admin user named admin@example.com with a password of "password" (without the quotes).

### Tests
For Rails we use [RSpec][rspec] for tests and for AngularJS we use [Jasmine][jasmine].

To run the Rails tests execute the following command:

    rake spec

We really like [Testacular][testacular] but we couldn't figure out how to get it to integrate nicely
with the asset pipeline so instead we use the [Jasmine gem][jasmine-gem].  To run the AngularJS
tests execute the following command:

    rake jasmine

### Design Notes
There are probably a lot of questions about why we chose to do things the way we did and we are happy to help answer any questions
you may have.  This app was originally written to integrate into a larger internal Rails application so some of the directory structure
was driven by how we separate out the individual views for the larger application.

#### AngularJS
We've tried to keep with the general conventions of Rails when laying out the AngularJS pieces and this is what has worked for us so far.

* app/assets/javascripts - Contains all of our AngularJS javascript code
* app/assets/templates - Contains all of our AngularJS view/directive HTML templates

There are multiple ways of including views & directive HTML but we chose to asynchronously load the templates since this was developed
to run on an internal network.  Since this is part of a larger application it also keeps the user from having to download all of the markup
for the entire site up front.

#### Restful Services
When designing the JSON portions we tried to find something that would allow us to easily customize the JSON data and even
filter certain attributes based on the authenticated user.  We are utilizing the following components for serializing JSON between
Rails and AngularJS:

* [Active Model Serializers][ams]
* [Strong Parameters][sp]
* [Permitters][permitters]
* [Restful JSON][restful-json]
* [AngularJS Rails Resource][arr]

## Acknowledgements
This app builds on top of a lot of great projects and we thank everyone involved with those projects for making them available
for others to use and benefit from.

## Authors
This app was written by [FineLine Prototyping, Inc.](http://www.finelineprototyping.com) by the following contributors:
* Chris Chase (https://github.com/cfchase)
* Gary Weaver (https://github.com/garysweaver)
* Michael Goff
* Tommy Odom (https://github.com/tpodom)

## License

Copyright (c) 2013 FineLine Prototyping, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[aa]: http://activeadmin.info/
[ams]: https://github.com/rails-api/active_model_serializers
[sp]: https://github.com/rails/strong_parameters
[permitters]: http://www.broadcastingadam.com/2012/07/parameter_authorization_in_rails_apis/
[restful-json]: https://github.com/rubyservices/restful_json
[arr]: https://github.com/tpodom/angularjs-rails-resource
[jasmine]: http://pivotal.github.com/jasmine/
[jasmine-gem]: https://github.com/pivotal/jasmine-gem
[rspec]: http://rspec.info/
[angularjs]: http://angularjs.org
[testacular]: http://vojtajina.github.com/testacular/