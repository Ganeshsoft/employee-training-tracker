class CreateTrainingRecords < ActiveRecord::Migration
  def change
    create_table :training_records do |t|
      t.references :trainee, null: false
      t.references :competency, null: false
      t.references :trained_by, null: false
      t.date :trained_on, null: false
      t.references :certified_by, null: true
      t.date :certified_on, null: true

      t.timestamps
    end

    add_index :training_records, :trainee_id
    add_index :training_records, :competency_id
    add_index :training_records, :trained_by_id
    add_index :training_records, :certified_by_id
  end
end
