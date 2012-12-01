# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

AdminUser.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password')
User.create!(email: 'user@example.com', password: 'password', password_confirmation: 'password')
shipping = Department.create!(name: 'Shipping')
accounting = Department.create!(name: 'Accounting')

# Employee names generated from http://www.kleimo.com/random/name.cfm, so apologies if your name appears here
tabatha_lakes = Employee.create!(first_name: 'Tabatha', last_name: 'Lakes', department: shipping)
rosalinda_truby = Employee.create!(first_name: 'Rosalinda', last_name: 'Truby', department: shipping)
Employee.create!(first_name: 'Darryl', last_name: 'Rondon', department: shipping)
Employee.create!(first_name: 'Jamie', last_name: 'Ates', department: shipping)
mallory_ferranti = Employee.create!(first_name: 'Mallory', last_name: 'Ferranti', department: accounting)
nita_tunney = Employee.create!(first_name: 'Nita', last_name: 'Tunney', department: accounting)
Employee.create!(first_name: 'Carlene', last_name: 'Buel', department: accounting)
Employee.create!(first_name: 'Max', last_name: 'Brayton', department: accounting)

quality_procedures = CompetencyCategory.create!(name: 'Quality Procedures')
quality_control = CompetencyCategory.create!(name: 'Quality Control')

box_packing = Competency.create!(name: 'Box Packing', department: shipping, competency_category: quality_control, published_on: '2012-11-30', procedure_type: 'Work Instruction')
purchasing = Competency.create!(name: 'Purchasing', department: accounting, competency_category: quality_procedures, published_on: '2012-11-30', procedure_type: 'Procedure')

TrainingRecord.create!(trainee: tabatha_lakes, competency: box_packing, trained_by: rosalinda_truby, trained_on: '2012-12-01')
TrainingRecord.create!(trainee: mallory_ferranti, competency: purchasing, trained_by: nita_tunney, trained_on: '2012-12-01', certified_by: nita_tunney, certified_on: '2012-12-01')
