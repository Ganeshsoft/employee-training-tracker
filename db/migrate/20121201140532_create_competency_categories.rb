class CreateCompetencyCategories < ActiveRecord::Migration
  def change
    create_table :competency_categories do |t|
      t.string :name, null: false

      t.timestamps
    end
  end
end
