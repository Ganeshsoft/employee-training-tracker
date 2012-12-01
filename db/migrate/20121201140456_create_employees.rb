class CreateEmployees < ActiveRecord::Migration
  def change
    create_table :employees do |t|
      t.references :department, null: false
      t.string :first_name, null: false
      t.string :last_name, null: false

      t.timestamps
    end

    add_index :employees, :department_id

  end
end
