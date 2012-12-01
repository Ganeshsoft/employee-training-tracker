class CreateCompetencies < ActiveRecord::Migration
  def change
    create_table :competencies do |t|
      t.string :name, null: false
      t.date :published_on, null: false
      t.string :procedure_type, null: false
      t.references :competency_category, null: false
      t.references :department, null: true # can be null to indicate all departments

      t.timestamps
    end

    add_index :competencies, :competency_category_id
    add_index :competencies, :department_id
  end
end
